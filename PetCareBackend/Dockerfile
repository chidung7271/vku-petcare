# Multi-stage build for PetCare Backend NestJS
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json nest-cli.json ./
COPY src/ ./src/

RUN npm run build

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Create uploads directory with write permissions
RUN mkdir -p /app/uploads && chown -R node:node /app

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]
