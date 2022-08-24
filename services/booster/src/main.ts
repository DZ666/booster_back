import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import helmet from "helmet";
import { join } from "path";
import * as requestIp from "request-ip";
import { AppModule } from "./app.module";
import { ValidationErrorFilter } from "./pipes/filters/validation-error.filter";
import getEnvVars from "./tools/getEnvVars";

const { PORT, ORIGIN } = getEnvVars();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use("/assets", express.static(join(__dirname, "assets")));
  app.use(cookieParser());
  app.use(requestIp.mw());
  app.use(express.urlencoded({ extended: true, limit: "100mb" }));
  app.use(express.json({ limit: "100mb" }));
  app.enableCors({
    origin: [ORIGIN, "http://localhost:8000", "http://localhost:8003"],
    credentials: true,
  });

  app.useGlobalFilters(new ValidationErrorFilter());

  await app.listen(PORT);
}
bootstrap();
