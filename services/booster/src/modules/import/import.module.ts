import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import CurrencySchema, { Currency } from "../currency/schemas/currency.schema";
import { ImportService } from "./import.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Currency.name, schema: CurrencySchema },
    ]),
  ],
  providers: [ImportService],
})
export class ImportModule {}
