export type ENV_VARS = {
  NODE_ENV: "dev" | "stage" | "prod";
  PORT: string;
  WS_PORT: string;
  QUEUE_BOOSTER: string;
  MONGO_DB_URL: string;
  MONGO_DB_NAME_BOOSTER: string;
  JWT_SECRET: string;
  AUTH_ACTIVE_FOR: string;
  IS_TEST: string;
  ORIGIN: string;
  AUTHORIZATION_ON: string;
};
