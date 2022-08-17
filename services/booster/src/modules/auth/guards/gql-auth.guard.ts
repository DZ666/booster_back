import {
  ExecutionContext,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  SetMetadata,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { InjectConnection } from "@nestjs/mongoose";
import { AuthGuard } from "@nestjs/passport";
import { Connection, Types } from "mongoose";
import { User } from "src/modules/user/schemas/user.schema";
import getEnvVars from "src/tools/getEnvVars";
import { fail } from "src/tools/msTools";
import { checkPermissions } from "../decorators/roles";

const IS_PUBLIC_KEY = "isPublic",
  PERMISSION_REQUIRED = "permission_required";

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true),
  RequirePermission = permission =>
    SetMetadata(PERMISSION_REQUIRED, permission);

const _ENV = getEnvVars(),
  MS_PER_DAY = 24 * 60 * 60 * 1000; // hour * minutes * seconds * ms per s,

@Injectable()
export class GqlAuthGuard extends AuthGuard("jwt") {
  req: Request | any;
  res: Response | any;

  isPublic: any;

  cetelem: any;
  permission: any;

  jwt: string;
  jwt_session: string;

  activeSessions: any;

  impersonationSession: string;
  impersonationId: string;

  constructor(
    private reflector: Reflector,
    @InjectConnection() private readonly conn: Connection,
    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {
    super();
  }

  private async checkOverrides(context: ExecutionContext, KEY: string) {
    return await this.reflector.getAllAndOverride<boolean>(KEY, [
      await context.getHandler(),
      await context.getClass(),
    ]);
  }

  private async formData(context) {
    // Getting Http Context from context
    const httpContext = await context.getArgByIndex(2);

    // Setting all class variables
    this.req = await httpContext.req;
    this.res = await httpContext.res;

    this.isPublic = await this.checkOverrides(context, IS_PUBLIC_KEY);

    this.permission = await this.checkOverrides(context, PERMISSION_REQUIRED);

    this.jwt = this.req?.headers?.authorization?.replace("Bearer ", "") || "";
    this.jwt_session = this.req?.cookies?.jwt_session || "";

    this.impersonationSession =
      this.req?.headers?.impersonationsession?.toString() || "";
  }

  async authenticate() {
    if (!this.jwt) return;
    try {
      const { _id }: User | any = await this.jwtService.verify(this.jwt, {
        secret: this.configService.get("JWT_SECRET"),
      });
      const dbUser: any = await this.conn.collection("users").findOne({ _id });
      if (dbUser) {
        const { activeSessions, ...rest } = await dbUser;
        this.activeSessions = await activeSessions;
        this.req.user = await { ...rest, token: this.jwt };
      }
    } catch (error) {
      console.log(this);
      console.log(error);
    }
  }

  async authorize() {
    if (_ENV.AUTHORIZATION_ON === "false" || this.isPublic) {
      return true;
    }

    if (!this.jwt) {
      fail("no jwt token found", HttpStatus.UNAUTHORIZED);
    }

    if (!this.jwt_session) {
      fail("no active jwt session found", HttpStatus.UNAUTHORIZED);
    }

    if (!this.req.user) {
      fail("not authenticated", HttpStatus.UNAUTHORIZED);
    }

    if (
      !Array.isArray(this.activeSessions) ||
      this.activeSessions.length === 0
    ) {
      this.res.clearCookie("jwt_session");
      fail("no active session", HttpStatus.UNAUTHORIZED);
    }

    const dateNow = new Date();
    const newActiveSessions = await this.activeSessions.filter(
      session =>
        session.lastActiveTime &&
        +dateNow - session.lastActiveTime < +_ENV.AUTH_ACTIVE_FOR * MS_PER_DAY,
    );

    const { _id } = (await this.req.user) as any;

    await this.conn.collection("users").updateOne(
      { _id },
      {
        $set: {
          activeSessions: newActiveSessions,
        },
      },
    );

    if (!newActiveSessions.some(obj => obj.sessionId === this.jwt_session)) {
      this.res.clearCookie("jwt_session");
      fail("Session wasn't found", HttpStatus.UNAUTHORIZED);
    }

    let user: any;

    if (this.impersonationId) {
      user = await this.conn
        .collection("users")
        .findOne({ _id: new Types.ObjectId(this.impersonationId) });
    }

    const permissions = await checkPermissions(
      this.permission,
      this.req.user,
      this.conn,
    );

    if (permissions === false) {
      throw new UnauthorizedException(
        null,
        `${this.permission} permission required`,
      );
    }

    let operator = null;
    if (user) {
      operator = { ...this.req.user, permissions };
      user = await user;
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { activeSessions, ...rest } = await user;
        user = await rest;
      } else {
        throw new InternalServerErrorException(
          "Impersonated user is not found",
        );
      }
    }
    this.req.user = await {
      ...(user ? await user : await this.req.user),
      ...(!operator ? { permissions } : {}),
      operator,
    };

    return true;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await this.formData(context);

    await this.authenticate();
    return await this.authorize();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
