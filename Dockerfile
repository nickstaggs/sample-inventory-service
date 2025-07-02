# Use official Node.js image
FROM node:18-alpine

# Install OpenTelemetry dependencies
RUN apk add --no-cache python3 make g++

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev:start; else npm start; fi"]
