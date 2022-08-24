import { Catch, HttpStatus, RpcExceptionFilter } from "@nestjs/common";
import { Error } from "mongoose";
import ValidationError = Error.ValidationError;

@Catch(ValidationError)
export class ValidationErrorFilter implements RpcExceptionFilter {
  catch(exception: ValidationError): any {
    if (exception) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        catchedAt: "ValidationErrorFilter",
        message: exception,
      };
    }
  }
}
