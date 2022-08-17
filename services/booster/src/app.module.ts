import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";
import { DirectiveLocation, GraphQLDirective } from "graphql";
import validate from "./config/env.validation";
import validationSchema, {
  validationOptions,
} from "./config/validation.schema";
import { UsersModule } from "./modules/user/user.module";
import getEnvVars from "./tools/getEnvVars";
import { upperDirectiveTransformer } from "./tools/upper-case.directive";

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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: "schema.gql",
      context: ({ req, res }) => ({ req, res }),
      cors: {
        credentials: true,
        origin: true,
      },
      transformSchema: schema => upperDirectiveTransformer(schema, "upper"),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: "upper",
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      formatError: (error: any) => {
        const graphQLFormattedError = {
          message:
            error.extensions?.exception?.response?.message || error.message,
          code: error.extensions?.code || "SERVER_ERROR",
          name: error.extensions?.exception?.name || error.name,
        };
        return graphQLFormattedError;
      },
    }),
  ],
})
export class AppModule {}
