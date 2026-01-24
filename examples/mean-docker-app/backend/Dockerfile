# Etapa 1: Base
FROM node:18-alpine AS base
WORKDIR /app

# Etapa 2: Dependencias
FROM base AS dependencies
COPY package*.json ./
RUN npm ci --only=production

# Etapa 3: Desarrollo (incluye dev dependencies)
FROM base AS development
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Etapa 4: Build
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .

# Etapa 5: Producción
FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/ ./
EXPOSE 3000

# Crear usuario no privilegiado
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs
CMD ["node", "server.js"]
