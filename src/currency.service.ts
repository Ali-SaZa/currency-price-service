import axios from 'axios';
import { Currency } from './currency.schema';

export class CurrencyService {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async fetchAndUpdateCurrencyPrices(): Promise<void> {
    try {
      console.log('Fetching currency prices from API...');
      const response = await axios.get(this.apiUrl, { 
        params: { key: this.apiKey },
        timeout: 10000 // 10 second timeout
      });

      const allItems = [...response.data.gold, ...response.data.currency];
      let updatedCount = 0;
      let errorCount = 0;

      for (const item of allItems) {
        const { symbol, price } = item;
        if (!symbol || price == null) {
          console.warn(`Skipping item with missing symbol or price:`, item);
          continue;
        }

        try {
          const result = await Currency.updateOne(
            { symbol },
            { $set: { price, last_updated: new Date() } }
          );

          if (result.modifiedCount > 0) {
            updatedCount++;
          }
        } catch (error) {
          console.error(`Error updating currency ${symbol}:`, error);
          errorCount++;
        }
      }

      console.log(`Currency prices updated at ${new Date().toLocaleString()}`);
      console.log(`Updated: ${updatedCount}, Errors: ${errorCount}`);
    } catch (error) {
      console.error('Error fetching/updating currency prices:', error);
      throw error;
    }
  }

  async getCurrencyCount(): Promise<number> {
    try {
      return await Currency.countDocuments();
    } catch (error) {
      console.error('Error getting currency count:', error);
      throw error;
    }
  }

  async getLastUpdateTime(): Promise<Date | null> {
    try {
      const currency = await Currency.findOne().sort({ last_updated: -1 });
      return currency?.last_updated || null;
    } catch (error) {
      console.error('Error getting last update time:', error);
      throw error;
    }
  }
} 