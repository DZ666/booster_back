import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Currency,
  CurrencyDocument,
} from "../currency/schemas/currency.schema";
import currencies from "./imports/currencies";

@Injectable()
export class ImportService {
  constructor(
    @InjectModel(Currency.name)
    private readonly currencyModel: Model<CurrencyDocument>,
  ) {
    this.importCurrencies();
  }

  async importCurrencies() {
    await Promise.all(
      currencies.map(
        async currency =>
          !(await this.currencyModel.findOne({
            utilName: currency.utilName,
          })) && (await this.currencyModel.create(currency)),
      ),
    );
  }
}
