import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import validate from "./config/env.validation";
import validationSchema, {
  validationOptions,
} from "./config/validation.schema";
import { UsersModule } from "./modules/user/user.module";
import getEnvVars from "./tools/getEnvVars";

const { MONGO_DB_URL, MONGO_DB_NAME_BOOSTER } = getEnvVars();

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
      validationOptions,
      envFilePath: [".env", ".local.env", ".stage.env"],
      validate,
      isGlobal: true,
    }),
    MongooseModule.forRoot(MONGO_DB_URL, { dbName: MONGO_DB_NAME_BOOSTER }),
    UsersModule,
  ],
})
export class AppModule {}
