# Currency Price Service

A standalone service for fetching and updating currency prices from an external API and storing them in MongoDB.

## Features

- Fetches currency prices from external API every minute (configurable)
- Updates MongoDB database with latest prices
- Graceful error handling and logging
- Configurable update intervals
- Graceful shutdown handling

## Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Access to the currency API (BRS API)

## Installation

1. Clone or download this service
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   ```env
   # Database
   MONGO_CONNECTION_STRING=mongodb://localhost:27017/telegram-bot
   
   # API Configuration
   BRS_API_ADDRESS=https://api.example.com/currency
   BRS_API_KEY=your_api_key_here
   
   # Service Configuration
   UPDATE_INTERVAL=60000
   ```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Watch mode (auto-restart on changes)
```bash
npm run watch
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGO_CONNECTION_STRING` | MongoDB connection string | Yes | - |
| `BRS_API_ADDRESS` | Currency API endpoint | Yes | - |
| `BRS_API_KEY` | API key for currency service | Yes | - |
| `UPDATE_INTERVAL` | Update interval in milliseconds | No | 60000 (1 minute) |

## Database Schema

The service uses the following MongoDB collection: `currencies`

```typescript
interface Currency {
  symbol: string;           // Currency symbol (e.g., "USD", "EUR")
  name_en: string;          // English name
  name: string;             // Localized name
  price: number;            // Current price
  change_percent: number;   // Price change percentage
  unit: string;             // Currency unit
  last_updated: Date;       // Last update timestamp
}
```

## Logging

The service provides detailed logging:
- Connection status
- API fetch attempts
- Update statistics
- Error details
- Graceful shutdown messages

## Error Handling

- Network timeouts (10 seconds)
- Invalid API responses
- Database connection issues
- Individual currency update failures

The service continues running even if individual updates fail, ensuring high availability.

## Stopping the Service

Use `Ctrl+C` (SIGINT) or `kill` command (SIGTERM) for graceful shutdown.

## Integration with Main Bot

This service is designed to work alongside your main Telegram bot. The bot will read currency prices from the same MongoDB database that this service updates.

## Troubleshooting

1. **Connection Issues**: Check your MongoDB connection string
2. **API Errors**: Verify your API key and endpoint
3. **No Updates**: Check API response format matches expected structure
4. **High Memory Usage**: Consider increasing update interval

## License

MIT 