import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export default class LoginUserDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  password: string;
}
