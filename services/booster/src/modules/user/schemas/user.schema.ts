import { ObjectType, InputType, Field } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import UserWalletSchema, { UserWallet } from "./user-wallet.schema";

export type UserDocument = User & Document;

@ObjectType()
@InputType("GetUserDataQuery")
@Schema()
export class User {
  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  name: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: true })
  pwd: string;

  @Field(() => [UserWallet], { nullable: true })
  @Prop({
    type: [UserWalletSchema],
  })
  wallets: UserWallet[];
}

const UserSchema = SchemaFactory.createForClass(User);

export default UserSchema;
