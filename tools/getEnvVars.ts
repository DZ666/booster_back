import * as dotenv from "dotenv";
import { ENV_VARS } from "../../envType";

let path = "";
switch (process.env.NODE_ENV) {
  case "prod":
    path = ".env";
    break;
  case "stage":
    path = ".stage.env";
    break;
  default:
    path = ".local.env";
    break;
}
dotenv.config({ path });

export default function (): ENV_VARS {
  return process.env as ENV_VARS;
}
