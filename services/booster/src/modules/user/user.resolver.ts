import { UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Args, Context, Query, Resolver, Root } from "@nestjs/graphql";
import { map, Observable } from "rxjs";
import Public from "../auth/decorators/public";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { AuthService } from "./auth.service";
import { UserSignedUp } from "./interfaces/user";
import { User } from "./schemas/user.schema";
import { UserSignUp, UserSignIn } from "./user.model";
import { UserService } from "./user.service";

@Resolver(() => Root)
export class UsersResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Query(() => UserSignUp)
  userSignUp(
    @Args("email", { type: () => String }) email: string,
    @Args("pwd", { type: () => String }) pwd: string,
    @Args("name", { type: () => String }) name?: string,
  ): Observable<UserSignedUp> {
    return this.authService.create({ email, pwd, name });
  }

  @Public()
  @Query(() => UserSignIn)
  @UseGuards(GqlAuthGuard)
  userSignIn(
    @Args("email", { type: () => String }) email: string,
    @Args("pwd", { type: () => String }) pwd: string,
  ): Observable<Record<string, unknown>> {
    return this.authService.login({ email, pwd }).pipe(
      map((jwt: string) => ({
        access_token: jwt,
        token_type: "JWT",
        expires_in: this.configService.get("AUTH_ACTIVE_FOR"),
      })),
    );
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  getUserData(@Context("req") { user }) {
    delete user["token"];
    return user;
  }
}
