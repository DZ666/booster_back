import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import CurrencySchema, { Currency } from "../currency/schemas/currency.schema";
import { AuthService } from "./auth.service";
import { UserRepository } from "./repository/user.repository";
import UserSchema, { User } from "./schemas/user.schema";
import { UsersResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require("mongoose-unique-validator"));
          return schema;
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: Currency.name, schema: CurrencySchema },
    ]),
    AuthModule,
  ],
  providers: [UsersResolver, UserService, AuthService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UsersModule {}
