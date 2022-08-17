import { HttpStatus } from "@nestjs/common";
export default interface IUser {
  email: string;
  pwd?: string;
  name?: string;
}

export type UserSignedUp = {
  status: HttpStatus;
  message: string;
};
