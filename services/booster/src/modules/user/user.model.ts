import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsDefined, IsString, IsNotEmpty } from "class-validator";
import { HttpStatus } from "@nestjs/common";

@ObjectType()
@InputType("UserSignUpInput")
export class UserSignUp {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  status: HttpStatus;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  message: string;
}

@ObjectType()
@InputType("UserSignInInput")
export class UserSignIn {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Field(() => String)
  access_token: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Field(() => String)
  token_type: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Field(() => String)
  expires_in: string;
}

@ObjectType()
@InputType("GetUserDataQuery")
export class GetUserData {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  name?: string;
}
