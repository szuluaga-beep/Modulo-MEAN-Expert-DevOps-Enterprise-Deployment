# Clase 2: Docker - Contenedores para Aplicaciones MEAN

## 🎯 Objetivos de la Clase

Al finalizar esta clase, serás capaz de:
- ✅ Comprender los fundamentos de Docker y contenedorización
- ✅ Crear Dockerfiles optimizados para cada componente del stack MEAN
- ✅ Usar Docker Compose para orquestar aplicaciones multi-contenedor
- ✅ Implementar networking entre contenedores
- ✅ Gestionar volúmenes y persistencia de datos
- ✅ Aplicar best practices de seguridad en contenedores

---

## 📚 Tabla de Contenidos

1. [Introducción a Docker](#introducción-a-docker)
2. [Arquitectura de una App MEAN Dockerizada](#arquitectura-de-una-app-mean-dockerizada)
3. [Proyecto Práctico: Task Manager App](#proyecto-práctico-task-manager-app)
4. [Dockerfile para Backend Node.js](#dockerfile-para-backend-nodejs)
5. [Dockerfile para Frontend Angular](#dockerfile-para-frontend-angular)
6. [Docker Compose Completo](#docker-compose-completo)
7. [Comandos Docker Esenciales](#comandos-docker-esenciales)
8. [Optimización y Best Practices](#optimización-y-best-practices)
9. [Ejercicios Prácticos](#ejercicios-prácticos)

---

## Introducción a Docker

### ¿Qué es Docker?

Docker es una plataforma de contenedorización que permite empaquetar aplicaciones con todas sus dependencias en contenedores ligeros y portables.

### Conceptos Clave

**Contenedor**: Es una unidad aislada que contiene:
- Código de la aplicación
- Runtime (Node.js, Java, etc.)
- Dependencias y librerías
- Variables de entorno
- Configuración

**Imagen Docker**: Es como una "plantilla" o "clase" que define qué debe contener un contenedor. Se construye desde un Dockerfile.

**Ventajas de Docker**:
- 🚀 **Portabilidad**: "Funciona en mi máquina" = "Funciona en todas partes"
- 📦 **Aislamiento**: Cada contenedor es independiente
- ⚡ **Ligereza**: Arrancan en segundos
- 🔄 **Escalabilidad**: Fácil replicación de servicios
- 🎯 **Consistencia**: Mismo entorno en desarrollo, testing y producción

### Diagrama Básico

```
Desarrollador          Producción
──────────────────────────────────
  App                   App
  ↓                     ↓
┌─────────────┐   ┌─────────────┐
│ Container   │   │ Container   │
└─────┬───────┘   └─────┬───────┘
      │                 │
   "Funciona en      "Funciona en
    mi máquina"      el servidor"
      └─────────────────────────────┘
            Mismo Dockerfile
```

---

## Arquitectura de una App MEAN Dockerizada

### Diagrama de la Solución

```
╔════════════════════════════════════════════════════════════════╗
║           Docker Network (bridge)                              ║
║                                                                ║
║  ┌──────────────────┐   ┌──────────────────┐   ┌──────────┐ ║
║  │   Angular        │   │  Node.js +       │   │MongoDB   │ ║
║  │  Frontend        │◄─►│   Express        │◄─►│Database  │ ║
║  │  :4200           │   │   Backend        │   │ :27017   │ ║
║  │ (Nginx)          │   │   :3000          │   │          │ ║
║  └──────────────────┘   └──────────────────┘   └──────────┘ ║
║       Container            Container           Container     ║
╚════════════════════════════════════════════════════════════════╝
          ↑                    ↑                    ↑
    Port Mapping         Port Mapping         Volúmenes
          ↓                    ↓                    ↓
  localhost:4200      localhost:3000        Persistencia
```

### Stack MEAN Explicado

| Componente | Función | Puerto | Docker Base Image |
|------------|---------|--------|-------------------|
| **MongoDB** | Base de datos NoSQL | 27017 | mongo:7.0-alpine |
| **Express** | Framework backend | 3000 | node:20-alpine |
| **Angular** | Frontend framework | 4200 | nginx:alpine |
| **Node.js** | Runtime JS | - | node:20-alpine |

---

## Proyecto Práctico: Task Manager App

### Descripción

Crearemos una aplicación de gestión de tareas completa con:
- **Frontend**: Angular 17+ con Material Design
- **Backend**: Node.js + Express con TypeScript
- **Database**: MongoDB
- **Orquestación**: Docker Compose

### Estructura del Proyecto

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── task.model.ts
│   │   ├── routes/
│   │   │   └── tasks.routes.ts
│   │   ├── controllers/
│   │   │   └── tasks.controller.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── environments/
│   │   └── main.ts
│   ├── angular.json
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── docker-compose.yml
├── mongo-init.js
└── README.md
```

---

## Dockerfile para Backend Node.js

### 📄 `backend/Dockerfile` - Multi-stage Build

```dockerfile
# ============================================
# ETAPA 1: BUILD
# ============================================
FROM node:20-alpine AS builder

# Metadata
LABEL maintainer="tu-email@example.com"
LABEL description="Task Manager Backend"

# Directorio de trabajo
WORKDIR /app

# Copiar package.json primero (aprovecha cache)
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# ============================================
# ETAPA 2: PRODUCCIÓN
# ============================================
FROM node:20-alpine

# Instalar dumb-init para manejo correcto de señales
RUN apk add --no-cache dumb-init

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copiar solo lo necesario de la etapa anterior
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error('Health check failed')})" || exit 1

# Comando de inicio
CMD ["dumb-init", "node", "dist/server.js"]
```

### 📄 `backend/package.json`

```json
{
  "name": "task-manager-backend",
  "version": "1.0.0",
  "description": "Task Manager API",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "typescript": "^5.3.3",
    "ts-node-dev": "^2.0.0"
  }
}
```

### 📄 `backend/src/server.ts` - Servidor Express

```typescript
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/taskmanager';

// Middlewares de seguridad
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString()
  });
});

// Rutas de ejemplo
app.get('/api/tasks', (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: 'Tasks endpoint working',
    data: []
  });
});

// Error handling
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Conectar a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});

export default app;
```

### 📄 `backend/.dockerignore`

```
node_modules
npm-debug.log
.git
.env
.env.local
dist
build
.vscode
.idea
COVERAGE
*.md
.DS_Store
```

---

## Dockerfile para Frontend Angular

### 📄 `frontend/Dockerfile` - Multi-stage con Nginx

```dockerfile
# ============================================
# ETAPA 1: BUILD
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar Angular CLI
RUN npm install -g @angular/cli@17

COPY package*.json ./

# Instalar dependencias
RUN npm ci

COPY . .

# Build de producción
RUN ng build --configuration production

# ============================================
# ETAPA 2: PRODUCCIÓN
# ============================================
FROM nginx:alpine

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos compilados
COPY --from=builder /app/dist/task-manager-frontend/browser /usr/share/nginx/html

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### 📄 `frontend/nginx.conf`

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Angular routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache para assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### 📄 `frontend/.dockerignore`

```
node_modules
.git
.env
.vscode
.idea
dist
build
coverage
*.md
.DS_Store
```

---

## Docker Compose Completo

### 📄 `docker-compose.yml` - Orquestación de Servicios

```yaml
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:7.0-alpine
    container_name: taskmanager-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secretpassword123
      MONGO_INITDB_DATABASE: taskmanager
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    networks:
      - app-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # Node.js Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: taskmanager-backend
    restart: unless-stopped
    depends_on:
      mongodb:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: 3000
      MONGODB_URI: mongodb://admin:secretpassword123@mongodb:27017/taskmanager?authSource=admin
      FRONTEND_URL: http://localhost:4200
    ports:
      - "3000:3000"
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Angular Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: taskmanager-frontend
    restart: unless-stopped
    depends_on:
      - backend
    ports:
      - "4200:80"
    networks:
      - app-network
    environment:
      API_URL: http://localhost:3000

networks:
  app-network:
    driver: bridge

volumes:
  mongodb_data:
    driver: local
```

### 📄 `mongo-init.js` - Inicialización de MongoDB

```javascript
// Conectar a la base de datos
db = db.getSiblingDB('taskmanager');

// Crear colección de tasks
db.createCollection('tasks');

// Crear índices
db.tasks.createIndex({ "status": 1, "priority": 1 });
db.tasks.createIndex({ "createdAt": -1 });

// Insertar datos de ejemplo
db.tasks.insertMany([
  {
    title: "Aprender Docker",
    description: "Entender conceptos de contenedorización",
    status: "completed",
    priority: "high",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Configurar docker-compose",
    description: "Orquestar múltiples servicios",
    status: "in-progress",
    priority: "high",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Desplegar en producción",
    description: "Publicar aplicación en servidor",
    status: "pending",
    priority: "medium",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('✅ Database initialized!');
```

---

## Comandos Docker Esenciales

### 🚀 Docker Compose

```bash
# Iniciar todos los servicios en background
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Ver estado de los contenedores
docker-compose ps

# Detener todos los servicios
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener, eliminar contenedores y volúmenes (CUIDADO)
docker-compose down -v

# Reconstruir las imágenes
docker-compose build

# Reconstruir y reiniciar
docker-compose up -d --build

# Ejecutar comando en un contenedor
docker-compose exec backend sh

# Ver uso de recursos
docker-compose stats
```

### 🐳 Docker Básico

```bash
# Listar contenedores activos
docker ps

# Listar todos los contenedores
docker ps -a

# Listar imágenes
docker images

# Ver logs
docker logs -f taskmanager-backend

# Acceder a un contenedor
docker exec -it taskmanager-backend sh

# Detener contenedor
docker stop taskmanager-backend

# Eliminar contenedor
docker rm taskmanager-backend

# Eliminar imagen
docker rmi taskmanager-backend

# Limpiar recursos no utilizados
docker system prune -a
```

### 🔍 Debugging

```bash
# Ver toda la información de un contenedor
docker inspect taskmanager-backend

# Ver logs con timestamps
docker-compose logs --timestamps

# Verificar health check
docker inspect --format='{{json .State.Health}}' taskmanager-backend | jq

# Probar conectividad entre contenedores
docker-compose exec backend ping mongodb

# Ver variables de entorno
docker-compose exec backend env
```

---

## Optimización y Best Practices

### ✅ DO - Lo que DEBES hacer

```dockerfile
# ✅ Usar imágenes base específicas y ligeras
FROM node:20-alpine

# ✅ Multi-stage builds
FROM node:20-alpine AS builder
RUN npm run build

FROM node:20-alpine
COPY --from=builder /app/dist ./dist

# ✅ Copiar package.json primero (cache)
COPY package*.json ./
RUN npm ci
COPY . .

# ✅ Usar usuario no-root
USER nodejs

# ✅ Health checks
HEALTHCHECK --interval=30s CMD wget --spider http://localhost/health
```

### ❌ DON'T - Lo que DEBES evitar

```dockerfile
# ❌ Imágenes grandes
FROM node:latest

# ❌ Copiar todo primero
COPY . .
RUN npm install

# ❌ Ejecutar como root
# (sin USER)

# ❌ Variables sensibles en Dockerfile
ENV SECRET_KEY=mysecret
```

### 📋 Reducir Tamaño de Imágenes

```bash
# Analizar capas
docker history taskmanager-backend

# Comparar tamaños
docker images | grep taskmanager

# Resultado esperado:
# ANTES: ~500MB
# DESPUÉS: ~150MB (con multi-stage)
```

---

## Ejercicios Prácticos

### 🎯 Ejercicio 1: Levantar la Aplicación Completa

**Objetivo**: Tener toda la app funcionando

```bash
# 1. Clonar o crear estructura
mkdir task-manager && cd task-manager

# 2. Crear archivos necesarios (ver ejemplos arriba)

# 3. Levantar todo
docker-compose up -d --build

# 4. Verificar
docker-compose ps

# 5. Probar endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api/tasks

# 6. Acceder al frontend
# http://localhost:4200

# 7. Ver MongoDB
# Usar Mongo Express o mongosh
```

### 🎯 Ejercicio 2: Debugging de Problemas

**Escenario**: El backend no se conecta a MongoDB

```bash
# 1. Ver logs del backend
docker-compose logs backend

# 2. Verificar si MongoDB está corriendo
docker-compose ps mongodb

# 3. Verificar conectividad
docker-compose exec backend ping mongodb

# 4. Verificar variables de entorno
docker-compose exec backend env | grep MONGODB

# 5. Conectar directamente a MongoDB
docker-compose exec mongodb mongosh -u admin -p secretpassword123
```

### 🎯 Ejercicio 3: Desarrollo Local con Volumes

```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  backend:
    volumes:
      - ./backend/src:/app/src
    command: npm run dev
    environment:
      NODE_ENV: development
```

```bash
# Usar archivo de desarrollo
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Ahora los cambios en código se reflejan automáticamente
```

### 🎯 Ejercicio 4: Backup de Base de Datos

```bash
# Backup de MongoDB
docker-compose exec mongodb mongodump \
  -u admin -p secretpassword123 \
  --authenticationDatabase admin \
  --db taskmanager \
  --out /backup

# Copiar al host
docker cp taskmanager-mongodb:/backup ./backup

# Restore
docker-compose exec mongodb mongorestore \
  -u admin -p secretpassword123 \
  --authenticationDatabase admin \
  --db taskmanager \
  /backup/taskmanager
```

---

## 📚 Vocabulario Docker

| Término | Significado |
|---------|-----|
| **Imagen** | Plantilla que define un contenedor |
| **Contenedor** | Instancia en ejecución de una imagen |
| **Dockerfile** | Archivo con instrucciones para construir una imagen |
| **docker-compose.yml** | Archivo que define múltiples servicios |
| **Volumen** | Almacenamiento persistente |
| **Red** | Permite comunicación entre contenedores |
| **Puerto** | Mapeo de puertos host:contenedor |
| **Health Check** | Verifica si el contenedor está saludable |

---

## ✅ Checklist de Aprendizaje

- [ ] Entiendo qué es Docker y sus beneficios
- [ ] Puedo crear Dockerfiles optimizados
- [ ] Sé usar multi-stage builds
- [ ] Puedo crear docker-compose.yml funcionales
- [ ] Entiendo networking en Docker
- [ ] Gestiono volúmenes correctamente
- [ ] Conozco los comandos Docker esenciales
- [ ] Puedo debuggear problemas en contenedores
- [ ] Implemento health checks
- [ ] Aplico best practices de seguridad

---

## 📖 Recursos Adicionales

### Documentación Oficial
- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)

### Herramientas Útiles
- **Docker Desktop**: GUI para Docker
- **Portainer**: UI web para gestionar Docker
- **Dive**: Analizar capas de imágenes
- **Hadolint**: Linter para Dockerfiles

---

## 🚀 Próximos Pasos

En la **Clase 3**, aprenderemos:
- ⚙️ Orquestación con Kubernetes
- 📦 Deployments, Services, Pods
- 🔐 ConfigMaps y Secrets
- 🌐 Ingress Controllers
- 📈 Scaling automático (HPA)
- 📚 Helm Charts

---

## 💡 Tips Finales

```bash
# Alias útiles para tu ~/.bashrc o ~/.zshrc
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dcp='docker-compose ps'
alias dcb='docker-compose build'
alias dcr='docker-compose up -d --build'
alias dcx='docker-compose exec'
```

---

**¡Happy Dockerizing!** 🐳

¿Preguntas? Consulta en el foro del curso o las sesiones de Q&A.
