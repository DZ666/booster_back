import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { from, map, Observable, switchMap } from "rxjs";
import { AuthService as Auth } from "../auth/services/auth.service";
import {
  Currency,
  CurrencyDocument,
} from "../currency/schemas/currency.schema";
import { UserSignedUp } from "./interfaces/user";
import { UserRepository } from "./repository/user.repository";
import { UserDocument } from "./schemas/user.schema";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,

    @InjectModel(Currency.name)
    private readonly currencyModel: Model<CurrencyDocument>,

    private readonly authService: Auth,
  ) {}

  private validatePassword(
    pwd: string,
    storedPwd: string,
  ): Observable<boolean> {
    return this.authService.comparePwds(pwd, storedPwd);
  }

  public create(createUserDto): Observable<UserSignedUp> {
    return this.authService.hashPassword(createUserDto.pwd).pipe(
      switchMap((passwordHash: string) => {
        createUserDto.pwd = passwordHash;
        const res = from(this.currencyModel.find().select("_id name")).pipe(
          map((currencies: Array<Currency | any>) => {
            return currencies.map((currency: any) => {
              return {
                currency: currency._id,
                name: currency.name,
              };
            });
          }),
        );
        return res.pipe(
          switchMap(wallets => {
            return from(
              this.userRepository.save({ ...createUserDto, wallets }),
            ).pipe(
              map(() => {
                return {
                  message: "Авторизация успешно завершена.",
                  status: HttpStatus.OK,
                };
              }),
            );
          }),
        );
      }),
    );
  }

  public login({ email, pwd }): Observable<string> {
    return this.userRepository.findUserByEmail(email, "email pwd").pipe(
      switchMap((user: UserDocument) => {
        if (!user)
          throw new HttpException("User is not found", HttpStatus.NOT_FOUND);

        return this.validatePassword(pwd, user.pwd).pipe(
          switchMap((pwdMatches: boolean) => {
            if (!pwdMatches)
              throw new HttpException(
                "Login was not successfull",
                HttpStatus.UNAUTHORIZED,
              );
            return this.userRepository
              .findUserByEmail(email, "-pwd")
              .pipe(
                switchMap((user: UserDocument) =>
                  this.authService.generateJwt(user),
                ),
              );
          }),
        );
      }),
    );
  }
}
