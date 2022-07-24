import { forwardRef, Module, Scope } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../user/user.module";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthService } from "./services/auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalTokenStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (confgiService: ConfigService) => ({
        secret: confgiService.get("JWT_SECRET"),
        signOptions: { expiresIn: confgiService.get("AUTH_ACTIVE_FOR") },
      }),
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalTokenStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard, scope: Scope.REQUEST },
  ],
  exports: [AuthService],
})
export class AuthModule {}
