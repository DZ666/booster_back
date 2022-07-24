import * as Joi from "joi";

export const validationOptions = {
  allowUnkown: false,
  abortEarly: true,
};

export default Joi.object({
  NODE_ENV: Joi.string().valid("dev", "prod", "stage").default("dev"),
  PORT: Joi.number().default(8000),
});
