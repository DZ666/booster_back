import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import { UserRepository } from "./repository/user.repository";
import UserSchema, { User } from "./schemas/user.schema";
import { UsersResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  providers: [UsersResolver, UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UsersModule {}
