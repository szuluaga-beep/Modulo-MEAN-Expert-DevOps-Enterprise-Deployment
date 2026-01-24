# Etapa 1: Build
FROM node:18-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente y compilar
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Producción con Nginx
FROM nginx:alpine AS production
COPY --from=build /app/dist/mean-frontend /usr/share/nginx/html

# Configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
