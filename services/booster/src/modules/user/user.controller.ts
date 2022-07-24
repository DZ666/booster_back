import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { map, Observable } from "rxjs";
import Public from "../auth/decorators/public";
import CreateUserDto from "./dto/create-user.dto";
import LoginUserDto from "./dto/login-user.dto";
import IUser from "./interfaces/user";
import { UserService } from "./user.service";

@Controller("users")
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post("sign/up")
  create(@Body() createUserDto: CreateUserDto): Observable<IUser> {
    return this.userService.create(createUserDto);
  }

  @Public()
  @Post("sign/in")
  @HttpCode(HttpStatus.OK)
  login(
    @Body() loginUserDto: LoginUserDto,
  ): Observable<Record<string, unknown>> {
    return this.userService.login(loginUserDto).pipe(
      map((jwt: string) => ({
        access_token: jwt,
        token_type: "JWT",
        expires_in: this.configService.get("AUTH_ACTIVE_FOR"),
      })),
    );
  }

  @Public()
  @Get("me")
  @HttpCode(HttpStatus.OK)
  getUser() {
    return "Hie";
  }
}
