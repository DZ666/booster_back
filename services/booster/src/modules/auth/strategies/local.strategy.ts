import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { IS_PUBLIC_KEY } from "../decorators/public";

@Injectable()
export class LocalTokenStrategy extends PassportStrategy(
  Strategy,
  "local-token",
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {
    super();
  }
  async validate(req: Request | any) {
    const token = req?.cookies?.auth ?? req?.headers?.authorization;

    // const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);

    if (!token) {
      throw new UnauthorizedException();
    }

    const user = this.jwtService.decode(token, {
      json: true,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
