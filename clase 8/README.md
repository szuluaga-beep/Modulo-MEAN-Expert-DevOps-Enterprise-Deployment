# Despliegue en Producción con CI/CD y Docker

## Introducción

En esta clase final llevaremos nuestro proyecto MEAN a producción. Aprenderemos a containerizar con Docker, automatizar despliegues con GitHub Actions y alojar en plataformas cloud como Netlify (frontend) y Railway (backend).

---

## 1. Containerización con Docker

### ¿Por qué Docker?
- **Consistencia**: Mismo comportamiento en desarrollo y producción
- **Portabilidad**: Funciona en cualquier servidor con Docker
- **Escalabilidad**: Fácil de replicar contenedores
- **Aislamiento**: Cada servicio en su propio ambiente

---

### Dockerfile para Backend (Node.js)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```

### Dockerfile para Frontend (Angular)

```dockerfile
# Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

### Docker Compose (Orquestación)

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    environment:
      MONGODB_URI: mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongodb:27017/mean
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "3000:3000"
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

**Comandos básicos:**
```bash
docker-compose build    # Construir imágenes
docker-compose up -d    # Ejecutar en background
docker-compose logs -f  # Ver logs en tiempo real
docker-compose down     # Detener todo
```

---

## 2. GitHub Actions (CI/CD Automático)

### Flujo automático
```
Push a GitHub → Validar código → Tests → Build → Deploy
```

### Workflow básico

**.github/workflows/deploy.yml:**
```yaml
name: Deploy MEAN App

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      # Deploy frontend a Netlify
      - name: Deploy Frontend
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './frontend/dist'
          site-id: ${{ secrets.NETLIFY_SITE_ID_FRONTEND }}
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
      
      # Deploy backend a Netlify (funciones)
      - name: Deploy Backend
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './backend/dist'
          functions-dir: './backend/functions'
          site-id: ${{ secrets.NETLIFY_SITE_ID_BACKEND }}
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

---

## 3. Despliegue Frontend en Netlify

### Configuración automática

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Pasos en Netlify:
1. Conectar repositorio GitHub
2. Seleccionar rama a desplegar
3. Configurar variables de entorno
4. Click en "Deploy"

```bash
# Alternativamente con CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

---

## 4. Despliegue Backend en Netlify

### Configuración de Express para Netlify

**netlify.toml (backend):**
```toml
[build]
  command = "npm run build"
  functions = "functions"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/api"
  status = 200
```

### Estructura del Proyecto Backend

```
backend/
├── functions/
│   └── api.js          # Punto de entrada
├── src/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── app.js
├── package.json
└── netlify.toml
```

### Express como Netlify Function

**functions/api.js:**
```javascript
const app = require('../src/app');

exports.handler = async (event, context) => {
  // Envolver Express en función serverless
  return new Promise((resolve, reject) => {
    const handler = app(event, context, (err) => {
      if (err) reject(err);
    });
    
    resolve({
      statusCode: 200,
      body: handler
    });
  });
};
```

### Pasos de Despliegue en Netlify

1. **Conectar repositorio GitHub:**
   - Ir a netlify.com
   - Click en "New site from Git"
   - Seleccionar repositorio

2. **Configurar Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `functions`

3. **Configurar Variables de Entorno:**
   - Site settings → Build & Deploy → Environment
   - Añadir:
     ```
     MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
     JWT_SECRET=tu_secreto_seguro
     NODE_ENV=production
     ```

4. **Deploy:**
   - Los cambios en GitHub triggean deploy automático

### CLI de Netlify (Deploy Manual)

```bash
# Instalar
npm install -g netlify-cli

# Login
netlify login

# Deploy backend
netlify deploy --prod --dir=dist --functions=functions
```

### Serverless vs Tradicional

| Aspecto | Netlify Functions | Express Tradicional |
|--------|------------------|-------------------|
| **Escalado** | Automático | Manual |
| **Costo** | Pay-as-you-go | Instancia fija |
| **Cold start** | ~1-2 segundos | Inmediato |
| **Ideal para** | APIs ligeras | Apps pesadas |

---

## 5. Variables de Entorno y Secretos

### En GitHub Actions

```yaml
env:
  NODE_ENV: production

jobs:
  deploy:
    steps:
      - name: Deploy
        run: echo ${{ secrets.API_KEY }}
```

### En tu aplicación

```javascript
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;

if (!mongoUri || !jwtSecret) {
  throw new Error('Variables de entorno requeridas');
}
```

### .gitignore (IMPORTANTE)

```
node_modules/
dist/
.env
.env.local
*.log
```

---

## Arquitectura Típica MEAN en Producción (Netlify)

```
┌─────────────────┐
│   Navegador     │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────────┐
│   Netlify CDN       │  ← Frontend Angular (Static)
│  (Static Site)      │
└────────┬────────────┘
         │
         │ API Calls → /api/*
         ▼
┌─────────────────────┐
│ Netlify Functions   │  ← Backend Express (Serverless)
│ (Express API)       │
└────────┬────────────┘
         │
         │ MongoDB Connection
         ▼
┌─────────────────────┐
│  MongoDB Atlas      │  ← Base de Datos
│  (Cloud Service)    │
└─────────────────────┘
```

### Características de esta arquitectura:
- ✓ Todo bajo un mismo dominio (sin CORS)
- ✓ Escalado automático
- ✓ Sin servidores que mantener
- ✓ SSL/HTTPS automático
- ✓ Función de preview en PRs

---

## Health Check (Diagnosticar problemas)

```javascript
// En tu backend (Express)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
    database: 'connected'
  });
});
```

```bash
# Probar desde terminal
curl https://tu-sitio.netlify.app/api/health
```

---

## Troubleshooting Común

### "Cannot find module" en Netlify
```
✓ Verificar package.json tiene todas las dependencias
✓ Ejecutar localmente: npm install && npm run build
✓ Comprobar build command en netlify.toml
```

### Backend no se conecta a MongoDB
```
✓ Verificar MONGODB_URI correcta en variables Netlify
✓ Whitelist IPs en MongoDB Atlas (0.0.0.0/0 para)
✓ Probar formato: mongodb+srv://user:pass@cluster.mongodb.net/db
```

### CORS no es necesario
```
✓ Frontend y backend bajo mismo dominio (Netlify)
✓ Reedirige automático /api/* a functions
✓ Sin problemas de cross-origin
```

### Cold start en backend
```
✓ Primera llamada tarda ~1-2 segundos
✓ Esto es normal en funciones serverless
✓ Mantener MongoDB connection active
```

---

## Monitoreo en Netlify

```bash
# Ver logs de build
netlify logs:function-runs

# Ver función específica
netlify logs:function-runs --function=api

# Mostrador de análisis
netlify build
```

**En dashboard Netlify:**
- Site Analytics → ver requests
- Functions → ver invocaciones
- Deploy history → ver historial

---

## Checklist de Despliegue

- [ ] Código testeado localmente
- [ ] Variables de entorno documentadas
- [ ] Dockerfiles funcionales (opcional para local)
- [ ] Git workflow configurado
- [ ] MongoDB Atlas configurado
- [ ] netlify.toml en frontend y backend
- [ ] Frontend deployado en Netlify
- [ ] Backend (Express) deployado en Netlify Functions
- [ ] Variables de entorno configuradas en Netlify
- [ ] Health check funcionando
- [ ] CORS innecesario (mismo dominio)
- [ ] Logs accesibles en Netlify Analytics

---

## Mejores Prácticas

✓ Nunca commitear secrets o .env  
✓ Usar variables de entorno siempre  
✓ Automatizar despliegues con CI/CD  
✓ Mantener consistencia Docker dev/prod  
✓ Monitorizar logs y errores  
✓ Tener plan de rollback  
✓ Hacer backups regulares de BD  
✓ Documentar proceso de despliegue
