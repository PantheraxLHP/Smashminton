# Build stage
FROM node:slim

WORKDIR /app

# Install OpenSSL and other required dependencies
RUN apt-get update -y && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package files first
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the port
EXPOSE 8000

# Start the server using production build
CMD ["npm", "run", "start:prod"]
