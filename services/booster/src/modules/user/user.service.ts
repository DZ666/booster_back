import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { from, map, Observable, switchMap } from "rxjs";
import { AuthService } from "../auth/services/auth.service";
import CreateUserDto from "./dto/create-user.dto";
import LoginUserDto from "./dto/login-user.dto";
import IUser from "./interfaces/user";
import { UserRepository } from "./repository/user.repository";
import { UserDocument } from "./schemas/user.schema";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  private validatePassword(
    password: string,
    storedPassword: string,
  ): Observable<boolean> {
    return this.authService.comparePasswords(password, storedPassword);
  }

  public create(
    createUserDto: CreateUserDto,
  ): Observable<Omit<IUser, "password">> {
    return this.mailExisting(createUserDto.email).pipe(
      switchMap((exists: boolean) => {
        if (exists)
          throw new HttpException("Email already in use", HttpStatus.CONFLICT);

        return this.authService.hashPassword(createUserDto.password).pipe(
          switchMap((passwordHash: string) => {
            createUserDto.password = passwordHash;
            return from(this.userRepository.save(createUserDto)).pipe(
              map((savedUser: IUser) => {
                delete savedUser["password"];
                return savedUser;
              }),
            );
          }),
        );
      }),
    );
  }

  public login({ email, password }: LoginUserDto): Observable<string> {
    return this.userRepository.findUserByEmail(email, "email password").pipe(
      switchMap((user: UserDocument) => {
        if (!user)
          throw new HttpException("User is not found", HttpStatus.NOT_FOUND);

        return this.validatePassword(password, user.password).pipe(
          switchMap((passwordMatches: boolean) => {
            if (!passwordMatches)
              throw new HttpException(
                "Login was not successfull",
                HttpStatus.UNAUTHORIZED,
              );
            return this.userRepository
              .findUserByEmail(email, "-password")
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
