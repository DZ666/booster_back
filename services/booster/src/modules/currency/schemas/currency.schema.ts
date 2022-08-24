import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type CurrencyDocument = Currency & Document;

@ObjectType()
@InputType("GetCurrencyQuery")
@Schema()
export class Currency {
  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: true, unique: true, dropDups: true })
  utilName: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, default: "" })
  fetchDataUrl: string;

  @Field(() => Boolean, { nullable: true })
  @Prop({ type: Boolean, default: false })
  main: boolean;
}

const CurrencySchema = SchemaFactory.createForClass(Currency);

export default CurrencySchema;
