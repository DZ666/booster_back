import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { from, map, Observable, switchMap } from "rxjs";
import { fail } from "src/tools/msTools";
import { AuthService } from "../auth/services/auth.service";
import { UserSignedUp } from "./interfaces/user";
import { UserRepository } from "./repository/user.repository";
import { UserDocument } from "./schemas/user.schema";
import { UserSignIn } from "./user.model";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  private validatePassword(
    pwd: string,
    storedPwd: string,
  ): Observable<boolean> {
    return this.authService.comparePwds(pwd, storedPwd);
  }

  public create(createUserDto): Observable<UserSignedUp> {
    return this.mailExisting(createUserDto.email).pipe(
      switchMap((exists: boolean) => {
        if (exists) fail("Email already in use", HttpStatus.CONFLICT);

        return this.authService.hashPassword(createUserDto.pwd).pipe(
          switchMap((passwordHash: string) => {
            createUserDto.pwd = passwordHash;
            return from(this.userRepository.save(createUserDto)).pipe(
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

  public mailExisting(email: string): Observable<boolean> {
    return from(this.userRepository.findUserByEmail(email)).pipe(
      map((user: UserDocument) => (user ? true : false)),
    );
  }
}
