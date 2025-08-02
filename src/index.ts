import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { CurrencyService } from './currency.service';

// Load environment variables
dotenv.config();

// Environment variables
const API_URL = process.env.BRS_API_ADDRESS;
const API_KEY = process.env.BRS_API_KEY;
const MONGO_URI = process.env.MONGO_CONNECTION_STRING;
const UPDATE_INTERVAL = parseInt(process.env.UPDATE_INTERVAL || '60000'); // Default: 1 minute

// Validate required environment variables
if (!API_URL) {
  throw new Error('BRS_API_ADDRESS environment variable is required');
}
if (!API_KEY) {
  throw new Error('BRS_API_KEY environment variable is required');
}
if (!MONGO_URI) {
  throw new Error('MONGO_CONNECTION_STRING environment variable is required');
}

// Type assertions after validation - TypeScript now knows these are strings
const validatedApiUrl: string = API_URL;
const validatedApiKey: string = API_KEY;
const validatedMongoUri: string = MONGO_URI;

class CurrencyPriceService {
  private currencyService: CurrencyService;
  private isRunning = false;

  constructor() {
    this.currencyService = new CurrencyService(validatedApiUrl, validatedApiKey);
  }

  async start(): Promise<void> {
    try {
      console.log('Starting Currency Price Service...');
      console.log(`API URL: ${validatedApiUrl}`);
      console.log(`Update Interval: ${UPDATE_INTERVAL}ms (${UPDATE_INTERVAL / 1000} seconds)`);

      // Connect to MongoDB
      await mongoose.connect(validatedMongoUri);
      console.log('Connected to MongoDB');

      // Get initial stats
      const currencyCount = await this.currencyService.getCurrencyCount();
      console.log(`Found ${currencyCount} currencies in database`);

      const lastUpdate = await this.currencyService.getLastUpdateTime();
      if (lastUpdate) {
        console.log(`Last update: ${lastUpdate.toLocaleString()}`);
      }

      // Start the update loop
      this.isRunning = true;
      await this.runUpdateLoop();

    } catch (error) {
      console.error('Failed to start Currency Price Service:', error);
      process.exit(1);
    }
  }

  private async runUpdateLoop(): Promise<void> {
    console.log('Starting update loop...');

    // Run initial update
    await this.performUpdate();

    // Set up interval for subsequent updates
    const interval = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(interval);
        return;
      }
      await this.performUpdate();
    }, UPDATE_INTERVAL);

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\nReceived SIGINT, shutting down gracefully...');
      this.isRunning = false;
      clearInterval(interval);
      await mongoose.connection.close();
      console.log('Currency Price Service stopped');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\nReceived SIGTERM, shutting down gracefully...');
      this.isRunning = false;
      clearInterval(interval);
      await mongoose.connection.close();
      console.log('Currency Price Service stopped');
      process.exit(0);
    });
  }

  private async performUpdate(): Promise<void> {
    try {
      await this.currencyService.fetchAndUpdateCurrencyPrices();
    } catch (error) {
      console.error('Error in update loop:', error);
      // Don't exit the process, just log the error and continue
    }
  }
}

// Start the service
const service = new CurrencyPriceService();
service.start().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 