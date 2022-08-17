import * as path from "path";
import { format, createLogger, Logger, transports } from "winston";
import "winston-daily-rotate-file";
import getEnvVars from "./getEnvVars";

const _ENV = getEnvVars();
const colorizer = format.colorize();

function getTransports(module: NodeModule) {
  const trnsprts: any = [
    new transports.Console({
      format: format.combine(
        format.label({
          label: `[${path.parse(module.filename).name}]`,
        }),
        format.printf(
          msg =>
            `${colorizer.colorize(
              msg.level,
              `${msg.label}.${msg.level}`,
            )} - ${new Date().toLocaleTimeString("ru", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}  |${colorizer.colorize(msg.level, msg.message)}`,
        ),
      ),
    }),
  ];
  if (_ENV.NODE_ENV !== "dev") {
    trnsprts.push(
      new transports.DailyRotateFile({
        filename: "output.%DATE%.log",
        dirname: "/home/service/logs",
        maxFiles: "10d",
        format: format.combine(
          format.label({
            label: `[${path.parse(module.filename).name}]`,
          }),
          format.printf(
            msg =>
              `${msg.label}.${msg.level} - ${new Date().toLocaleTimeString(
                "ru",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                },
              )}  |${msg.message}`,
          ),
        ),
      }),
    );
  }
  return trnsprts;
}

export function getLogger(module: NodeModule): Logger {
  return createLogger({
    transports: getTransports(module),
  });
}
