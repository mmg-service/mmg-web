# 1. Docker Build
FROM node:20.19-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Runtime: Serve static files using "serve"
FROM node:20.19-slim

WORKDIR /app

# Install `serve` globally
RUN npm install -g serve

# Copy build output from builder
COPY --from=builder /app/dist /app/dist

EXPOSE 3000

# Serve static files from dist
CMD ["serve", "-s", "dist", "-l", "3000"]