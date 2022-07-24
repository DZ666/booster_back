import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export default class CreateUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  password: string;

  name?: string;
}
