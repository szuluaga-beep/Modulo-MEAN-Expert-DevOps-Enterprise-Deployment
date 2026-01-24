# Módulo 4: Full Stack MEAN Expert
## DevOps & Enterprise Deployment

### Contenido del Módulo

#### 🎯 Temas Principales
- **CI/CD, Docker y Kubernetes** - Automatización y orquestación de contenedores
- **Despliegue en AWS, Railway y Heroku** - Plataformas cloud empresariales
- **Monitorización, logging y seguridad avanzada** - Observabilidad y protección
- **Proyecto final empresarial Full Stack** - Defensa técnica incluida
- **Preparación laboral** - Portafolio, entrevistas y empleabilidad

---

## Clase 1: Introducción a DevOps y CI/CD

### Objetivos
- Comprender los principios fundamentales de DevOps
- Configurar pipelines básicos de CI/CD
- Automatizar procesos de integración y despliegue

### Temas Cubiertos

#### 1. Introducción a DevOps

DevOps es una filosofía cultural que elimina las barreras entre los equipos de desarrollo y operaciones, permitiendo que colaboren estrechamente para optimizar la productividad y confiabilidad. Los equipos trabajan de forma integrada, asumiendo responsabilidad compartida sobre todo el ciclo de vida del software y la infraestructura, pensando siempre en las necesidades del cliente.

<img width="847" height="502" alt="image" src="https://github.com/user-attachments/assets/77be9d49-b48a-4d48-af1f-c2fbc55c8242" />


**Cambio Cultural DevOps:**
- Eliminación las breachas entre desarrollo y operaciones
- Comunicación frecuente y colaboración constante
- Responsabilidad compartida del servicio completo
- Integración de equipos de QA y seguridad
- Visión holística del ciclo de vida del desarrollo

**Ciclo de Vida DevOps:**

```
┌─────────────────────────────────────────────────────────┐
│                   CICLO DEVOPS                          │
├─────────────────────────────────────────────────────────┤
│  Plan → Code → Build → Test → Release → Deploy → Monitor│
└─────────────────────────────────────────────────────────┘
```

**Beneficios Clave:**
- Innovación más rápida para los clientes
- Entregas frecuentes pero pequeñas
- Reducción de riesgos en cada implementación
- Identificación y resolución rápida de errores
- Mayor confiabilidad y velocidad en las actualizaciones

#### 2. Configuración de Pipelines Básicos

**¿Qué es un Pipeline?**

Un pipeline es una secuencia automatizada de pasos (tareas) que se ejecutan de manera consecutiva para transformar el código fuente en una aplicación lista para producción. Es como una línea de montaje en la manufactura, donde cada etapa realiza una función específica y el resultado se pasa a la siguiente etapa.

En el contexto de DevOps y CI/CD, un pipeline automatiza todo el ciclo de vida del software: desde que el código es enviado (commit) hasta que se despliega en los servidores de producción. Cada paso del pipeline ejecuta validaciones, pruebas y transformaciones automáticas, garantizando que el código cumpla con los estándares de calidad antes de llegar a producción.

**Características principales de un pipeline:**
- **Automatización**: Las tareas se ejecutan sin intervención manual
- **Secuencial**: Cada etapa se ejecuta en orden y solo continúa si la anterior fue exitosa
- **Feedback Rápido**: Detección inmediata de errores en cualquier etapa
- **Confiabilidad**: Asegura consistencia en cada despliegue
- **Velocidad**: Reduce significativamente el tiempo de entrega

Un pipeline de CI/CD automatiza las fases de integración, testing y despliegue del código, permitiendo entregas frecuentes, seguras y confiables. La combinación de microservicios y mayor frecuencia de publicación requiere automatización robusta para gestionar múltiples implementaciones.

**Arquitectura de un Pipeline:**

```
Código → Compilación → Testing → Staging → Producción
  ↓         ↓            ↓         ↓          ↓
 Git    Build Logs   Test Reports Deploy Logs Monitoring
```

**Prácticas Fundamentales:**

**Integración Continua (CI)**
- Automatización de pruebas en cada cambio
- Validación de código inmediata
- Generación de artefactos
- Detección temprana de errores

**Entrega Continua (CD)**
- Despliegues frecuentes pero pequeños
- Reducción de riesgo por implementación
- Identificación rápida de problemas
- Entregas confiables y predecibles

**Herramientas Comunes:**
- GitHub Actions
- GitLab CI/CD
- Jenkins
- CircleCI

**Documentación Oficial:**
- [AWS](https://aws.amazon.com/es/devops/what-is-devops/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)
- [Jenkins](https://www.jenkins.io/doc/)
- [CircleCI](https://circleci.com/docs/)

#### 3. Conceptos Clave

**Arquitectura de Microservicios**
- Desacoplamiento de sistemas complejos en servicios independientes
- Cada servicio con propósito único y operación independiente
- Reducción de coordinación necesaria para actualizaciones
- Equipos pequeños responsables de servicios específicos
- Mayor flexibilidad e innovación rápida

**Infrastructure as Code (IaC)**
- Gestión de infraestructura mediante código versionado
- Automatización de provisioning y configuración
- Reproducibilidad y consistencia en todos los ambientes
- Control de cambios y auditoría completa

**Monitoreo y Logging**
- Supervisión del desempeño de aplicaciones e infraestructura
- Reacción rápida ante problemas
- Visibilidad completa del sistema
- Feedback continuo para mejora

**Automatización de Procesos**
- Eliminación de tareas manuales repetitivas
- Consistencia en implementaciones
- Reducción de errores humanos
- Aceleración del ciclo de entrega

---

## Clase 2: Creación de Imágenes Docker para Aplicaciones MEAN

### Objetivos
- Comprender los conceptos fundamentales de Docker y contenedores
- Crear imágenes Docker para cada componente del stack MEAN
- Orquestar una aplicación MEAN completa usando Docker Compose
- Aplicar mejores prácticas en la creación de imágenes Docker

### Temas Cubiertos

#### 1. Introducción a Docker

**¿Qué es Docker?**

Docker es una plataforma de código abierto que permite desarrollar, enviar y ejecutar aplicaciones dentro de contenedores. Los contenedores son unidades ligeras y portátiles que empaquetan el código de la aplicación junto con todas sus dependencias, bibliotecas y configuraciones necesarias para ejecutarse de manera consistente en cualquier entorno.

<img width="847" alt="Docker Architecture" src="https://github.com/user-attachments/assets/docker-architecture.png" />

**Conceptos Clave:**

- **Contenedor**: Una instancia en ejecución de una imagen Docker. Es un proceso aislado que incluye todo lo necesario para ejecutar una aplicación.
- **Imagen**: Una plantilla de solo lectura con instrucciones para crear un contenedor. Incluye el código, runtime, bibliotecas y dependencias.
- **Dockerfile**: Un archivo de texto con instrucciones para construir una imagen Docker.
- **Registry**: Un repositorio para almacenar y distribuir imágenes Docker (ej: Docker Hub).
- **Docker Compose**: Herramienta para definir y ejecutar aplicaciones multi-contenedor.

**Ventajas de Docker:**

```
┌──────────────────────────────────────────────────────────────┐
│                    BENEFICIOS DE DOCKER                      │
├──────────────────────────────────────────────────────────────┤
│ ✓ Portabilidad: "Funciona en mi máquina" → "Funciona en      │
│   todas las máquinas"                                        │
│ ✓ Aislamiento: Cada contenedor es independiente             │
│ ✓ Eficiencia: Comparte el kernel del sistema operativo      │
│ ✓ Escalabilidad: Fácil crear múltiples instancias           │
│ ✓ Consistencia: Mismo comportamiento en dev, test y prod    │
│ ✓ Velocidad: Arranque en segundos vs minutos de VMs         │
└──────────────────────────────────────────────────────────────┘
```

**Docker vs Máquinas Virtuales:**

| Característica | Docker | Máquinas Virtuales |
|---------------|--------|-------------------|
| Tamaño | MB | GB |
| Tiempo de inicio | Segundos | Minutos |
| Aislamiento | Nivel de proceso | Nivel de hardware |
| Rendimiento | Nativo | Overhead por virtualización |
| Portabilidad | Alta | Media |

#### 2. El Stack MEAN

**¿Qué es MEAN?**

MEAN es un stack de tecnologías JavaScript/TypeScript para desarrollo full stack:

- **M**ongoDB - Base de datos NoSQL orientada a documentos
- **E**xpress - Framework web para Node.js
- **A**ngular - Framework frontend para aplicaciones web
- **N**ode.js - Entorno de ejecución JavaScript del lado del servidor

```
┌─────────────────────────────────────────────────┐
│           ARQUITECTURA MEAN STACK               │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐                              │
│  │   Angular    │  ← Frontend (Puerto 4200)    │
│  │  (Cliente)   │                              │
│  └──────┬───────┘                              │
│         │ HTTP/REST                             │
│  ┌──────▼───────┐                              │
│  │   Express    │  ← Backend API (Puerto 3000) │
│  │   Node.js    │                              │
│  └──────┬───────┘                              │
│         │ Driver MongoDB                        │
│  ┌──────▼───────┐                              │
│  │   MongoDB    │  ← Base de datos (27017)     │
│  │  (Database)  │                              │
│  └──────────────┘                              │
└─────────────────────────────────────────────────┘
```

**Ventajas del Stack MEAN:**
- JavaScript en toda la aplicación (frontend y backend)
- Desarrollo rápido y eficiente
- Comunidad activa y gran ecosistema de paquetes
- Escalabilidad y rendimiento
- Ideal para aplicaciones en tiempo real

#### 3. Dockerizando el Stack MEAN

**Estructura del Proyecto:**

```
mean-docker-app/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── angular.json
│   └── ...
├── docker-compose.yml
└── .dockerignore
```

#### 4. Creación de Imágenes Docker

**A. Dockerfile para MongoDB**

MongoDB tiene una imagen oficial en Docker Hub, por lo que normalmente no necesitamos crear un Dockerfile personalizado. En `docker-compose.yml`:

```yaml
mongodb:
  image: mongo:7.0
  container_name: mean-mongodb
  ports:
    - "27017:27017"
  environment:
    - MONGO_INITDB_ROOT_USERNAME=admin
    - MONGO_INITDB_ROOT_PASSWORD=secret123
    - MONGO_INITDB_DATABASE=meandb
  volumes:
    - mongodb_data:/data/db
    - ./init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro
```

**Archivo init-mongo.js** (opcional para inicializar datos):

```javascript
db = db.getSiblingDB('meandb');

db.createCollection('users');
db.users.insert({
  name: 'Usuario Demo',
  email: 'demo@mean.app',
  createdAt: new Date()
});

print('Base de datos inicializada correctamente');
```

**B. Dockerfile para Backend (Node.js + Express)**

```dockerfile
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
RUN npm run build

# Etapa 5: Producción
FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 3000
USER node
CMD ["node", "dist/server.js"]
```

**Explicación de las capas:**
- **Base**: Imagen base de Node.js Alpine (ligera)
- **Dependencies**: Solo dependencias de producción
- **Development**: Incluye todas las dependencias para desarrollo local
- **Build**: Compila TypeScript u otros archivos
- **Production**: Imagen final optimizada y segura

**C. Dockerfile para Frontend (Angular)**

```dockerfile
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
```

**Archivo nginx.conf**:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Configuración para Angular routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Configuración para API proxy (opcional)
    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Optimización de caché para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 5. Docker Compose para Orquestación

**docker-compose.yml completo:**

```yaml
version: '3.8'

services:
  # Base de datos MongoDB
  mongodb:
    image: mongo:7.0
    container_name: mean-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secret123
      MONGO_INITDB_DATABASE: meandb
    volumes:
      - mongodb_data:/data/db
      - ./init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro
    networks:
      - mean-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API (Express + Node.js)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: production
    container_name: mean-backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      MONGODB_URI: mongodb://admin:secret123@mongodb:27017/meandb?authSource=admin
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - mean-network
    volumes:
      - ./backend:/app
      - /app/node_modules

  # Frontend (Angular)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: production
    container_name: mean-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - mean-network

volumes:
  mongodb_data:
    driver: local

networks:
  mean-network:
    driver: bridge
```

#### 6. Mejores Prácticas

**A. Archivo .dockerignore**

```
node_modules
npm-debug.log
dist
.git
.gitignore
README.md
.env
.env.local
coverage
.vscode
.idea
*.log
```

**B. Optimización de Imágenes**

1. **Multi-stage builds**: Reducir tamaño final de la imagen
2. **Imágenes base Alpine**: Más ligeras (5MB vs 900MB)
3. **Caché de capas**: Copiar package.json antes del código fuente
4. **Usuario no-root**: Mayor seguridad en producción
5. **Health checks**: Verificar estado de los servicios

**C. Seguridad**

```dockerfile
# Ejemplo de buenas prácticas de seguridad
FROM node:18-alpine

# Actualizar paquetes del sistema
RUN apk update && apk upgrade

# Crear usuario no privilegiado
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app
COPY --chown=nodejs:nodejs . .

# Cambiar a usuario no-root
USER nodejs

CMD ["node", "server.js"]
```

#### 7. Comandos Docker Esenciales

**Construcción de Imágenes:**

```bash
# Construir una imagen individual
docker build -t mean-backend:latest ./backend

# Construir con Docker Compose
docker-compose build

# Construir sin caché
docker-compose build --no-cache
```

**Gestión de Contenedores:**

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs de servicios
docker-compose logs -f

# Ver estado de contenedores
docker-compose ps

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

**Inspección y Debug:**

```bash
# Ejecutar comandos en contenedor en ejecución
docker exec -it mean-backend sh

# Ver logs de un servicio específico
docker-compose logs backend

# Inspeccionar imagen
docker image inspect mean-backend:latest

# Ver uso de recursos
docker stats
```

**Limpieza:**

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no utilizadas
docker image prune -a

# Limpieza completa del sistema
docker system prune -a --volumes
```

#### 8. Ejercicio Práctico

**Objetivo**: Dockerizar una aplicación MEAN completa desde cero.

**Paso 1: Preparar el Proyecto**

```bash
# Crear estructura de directorios
mkdir -p mean-docker-app/{backend,frontend}
cd mean-docker-app
```

**Paso 2: Backend Simple (backend/server.js)**

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
// Note: En Docker, usa el nombre del servicio (mongodb) en lugar de localhost
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Modelo simple
const User = mongoose.model('User', {
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

// Rutas API
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando' });
});

app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
```

**Paso 3: Package.json del Backend**

```json
{
  "name": "mean-backend",
  "version": "1.0.0",
  "description": "Backend MEAN con Docker",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**Paso 4: Crear los Dockerfiles**

Crear los tres Dockerfiles mostrados anteriormente en las secciones correspondientes.

**Paso 5: Crear docker-compose.yml**

Usar el archivo docker-compose.yml completo mostrado anteriormente.

**Paso 6: Ejecutar la Aplicación**

```bash
# Construir las imágenes
docker-compose build

# Iniciar los servicios
docker-compose up -d

# Verificar que todo esté corriendo
docker-compose ps

# Ver los logs
docker-compose logs -f

# Probar el backend
curl http://localhost:3000/api/health

# Acceder al frontend
# Abrir navegador en http://localhost
```

**Paso 7: Verificar Conectividad**

```bash
# Crear un usuario de prueba
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Obtener todos los usuarios
curl http://localhost:3000/api/users
```

#### 9. Troubleshooting Común

**Problema 1: Contenedor no puede conectar a MongoDB**

```yaml
# Solución: Usar depends_on con healthcheck
depends_on:
  mongodb:
    condition: service_healthy
```

**Problema 2: Cambios en el código no se reflejan**

```bash
# Reconstruir sin caché
docker-compose build --no-cache
docker-compose up -d
```

**Problema 3: Puerto ya en uso**

```bash
# Ver qué proceso usa el puerto
sudo lsof -i :3000

# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Host:Container
```

**Problema 4: Volúmenes con permisos incorrectos**

```dockerfile
# Establecer permisos correctos en Dockerfile
RUN chown -R node:node /app
USER node
```

#### 10. Recursos Adicionales

**Documentación Oficial:**
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

**Herramientas Útiles:**
- [Dive](https://github.com/wagoodman/dive) - Analizar capas de imágenes Docker
- [Hadolint](https://github.com/hadolint/hadolint) - Linter para Dockerfiles
- [Docker Scout](https://docs.docker.com/scout/) - Análisis de seguridad

**Comandos de Referencia:**

```bash
# Ver todas las imágenes
docker images

# Ver todos los contenedores (incluso detenidos)
docker ps -a

# Ver uso de espacio en disco
docker system df

# Exportar/Importar imágenes
docker save -o mean-backend.tar mean-backend:latest
docker load -i mean-backend.tar

# Tagear imágenes para registry
docker tag mean-backend:latest myregistry/mean-backend:v1.0

# Push a registry
docker push myregistry/mean-backend:v1.0
```

---

### Conclusión de Clase 2

En esta clase hemos cubierto:
- ✅ Conceptos fundamentales de Docker y contenedores
- ✅ Arquitectura del stack MEAN
- ✅ Creación de Dockerfiles optimizados para cada componente
- ✅ Orquestación con Docker Compose
- ✅ Mejores prácticas de seguridad y optimización
- ✅ Ejercicio práctico completo

**Habilidades Adquiridas:**
- Dockerizar aplicaciones full stack
- Crear imágenes multi-stage eficientes
- Orquestar servicios con Docker Compose
- Aplicar mejores prácticas de seguridad
- Debugear y resolver problemas comunes

---

### Próximos Pasos
Continúa con los temas de Kubernetes y despliegue en plataformas cloud.
