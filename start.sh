#!/bin/bash

# Currency Price Service Startup Script

echo "Starting Currency Price Service..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create a .env file with the following variables:"
    echo "MONGO_CONNECTION_STRING=mongodb://localhost:27017/telegram-bot"
    echo "BRS_API_ADDRESS=https://your-api-endpoint.com"
    echo "BRS_API_KEY=your_api_key"
    echo "UPDATE_INTERVAL=60000"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the project
echo "Building the project..."
npm run build

# Start the service
echo "Starting the service..."
npm start 