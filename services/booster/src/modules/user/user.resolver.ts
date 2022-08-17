import { Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Args, Context, Query, Resolver, Root } from "@nestjs/graphql";
import { Request } from "express";
import { map, Observable } from "rxjs";
import Public from "../auth/decorators/public";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { UserSignedUp } from "./interfaces/user";
import { GetUserData, UserSignIn, UserSignUp } from "./user.model";
import { UserService } from "./user.service";

@Resolver(() => Root)
export class UsersResolver {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Query(() => UserSignUp)
  userSignUp(
    @Args("email", { type: () => String }) email: string,
    @Args("pwd", { type: () => String }) pwd: string,
    @Args("name", { type: () => String }) name?: string,
  ): Observable<UserSignedUp> {
    return this.userService.create({ email, pwd, name });
  }

  @Public()
  @Query(() => UserSignIn)
  @UseGuards(GqlAuthGuard)
  userSignIn(
    @Args("email", { type: () => String }) email: string,
    @Args("pwd", { type: () => String }) pwd: string,
    @Context() ctx,
  ): Observable<Record<string, unknown>> {
    console.log(ctx.req.cookies);
    // res.cookie("jwt_session", sessionId, {
    //   httpOnly: true,
    //   expires: new Date(date.setFullYear(date.getFullYear() + 1)),
    //   sameSite: "none",
    //   secure: _ENV.NODE_ENV !== "dev",
    // });
    return this.userService.login({ email, pwd }).pipe(
      map((jwt: string) => ({
        access_token: jwt,
        token_type: "JWT",
        expires_in: this.configService.get("AUTH_ACTIVE_FOR"),
      })),
    );
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => GetUserData)
  getUserData() {
    return "Hie";
  }
}
