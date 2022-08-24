import { Module } from "@nestjs/common";
import { CurrencyService } from "./currency.service";

@Module({
  providers: [CurrencyService],
})
export class CurrencyModule {}
