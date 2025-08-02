import mongoose, { Schema, Document } from 'mongoose';

export interface ICurrency extends Document {
  symbol: string;
  name_en: string;
  name: string;
  price: number;
  change_percent: number;
  unit: string;
  last_updated: Date;
}

const CurrencySchema = new Schema<ICurrency>({
  symbol: { type: String, required: true, unique: true },
  name_en: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  change_percent: { type: Number, required: true },
  unit: { type: String, required: true },
  last_updated: { type: Date, default: Date.now }
}, { timestamps: false });

export const Currency = mongoose.model<ICurrency>('Currency', CurrencySchema, 'currencies'); 