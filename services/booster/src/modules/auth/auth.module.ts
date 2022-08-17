import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../user/user.module";
import { GqlAuthGuard } from "./guards/gql-auth.guard";
import { AuthService } from "./services/auth.service";
import { LocalTokenStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (confgiService: ConfigService) => ({
        secret: confgiService.get("JWT_SECRET"),
        // signOptions: { expiresIn: "2 days" },
      }),
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, GqlAuthGuard, LocalTokenStrategy],
  exports: [AuthService, GqlAuthGuard, JwtModule],
})
export class AuthModule {}
