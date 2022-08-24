import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Currency } from "src/modules/currency/schemas/currency.schema";

export type UserWalletDocument = UserWallet & Document;

@ObjectType()
@InputType("GetUserWalletsQuery")
@Schema({ _id: false })
export class UserWallet {
  @Field(() => Currency, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Currency.name })
  currency: Currency;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, default: "" })
  userWallet: string;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, default: 0 })
  amountInUse: number;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, default: 0 })
  amountNotInUse: number;
}

const UserWalletSchema = SchemaFactory.createForClass(UserWallet);

export default UserWalletSchema;
