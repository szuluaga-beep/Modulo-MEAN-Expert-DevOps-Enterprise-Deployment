# Clase 4: Despliegue de Aplicaciones en Railway

## Introducción a Railway

Railway es una plataforma integral de despliegue en la nube que permite provisionar infraestructura, desarrollar localmente y desplegar aplicaciones de manera rápida y sencilla.

### Características principales:
- ✅ Despliegue en minutos desde GitHub, CLI o imágenes Docker
- ✅ Soporte para múltiples lenguajes y frameworks
- ✅ Gestión automática de bases de datos y servicios
- ✅ Dashboard intuitivo para monitoreo
- ✅ CLI para desarrollo local

---

## Conceptos Fundamentales

### 1. Dashboard
El punto de entrada principal donde se visualizan todos los proyectos asociados a tu cuenta.

### 2. Proyecto (Project)
Un contenedor que agrupa servicios relacionados bajo la misma red privada.

**Ventajas de usar proyectos:**
- Networking privado entre servicios
- Gestión centralizada de variables
- Facilita la colaboración en equipo

### 3. Servicio (Service)
Objetivo de despliegue para tu código fuente o imagen Docker.

**Características de un servicio:**
- Variables de configuración
- Backups automáticos
- Métricas de rendimiento
- Configuración de dominio

### 4. Despliegue (Deployment)
La unidad construida y entregable de un servicio. Incluye:
- Build (compilación)
- Logs de despliegue
- Seguimiento de cambios

### 5. Volúmenes (Volumes)
Almacenamiento persistente para servicios que requieren guardar datos.

**Funcionalidades:**
- Backups incrementales
- Copy-on-Write (ahorro de espacio)
- Restauración de backups

---

## Métodos de Despliegue

### Opción 1: Despliegue desde GitHub

**Paso a paso:**

1. **Crear un nuevo proyecto**
   - Accede a Railway Dashboard
   - Haz clic en "New Project"
   - Selecciona "GitHub repo"

2. **Conectar repositorio**
   - Autentica tu cuenta de GitHub
   - Busca y selecciona tu repositorio

3. **Iniciar despliegue**
   - Elige "Deploy Now" para despliegue inmediato
   - O "Add variables" para configurar primero

4. **Monitorear despliegue**
   - El proyecto se crea automáticamente
   - Se inicia el build y deployment
   - Visualiza el Project Canvas

**Ventajas:**
- Despliegue automático en cada push
- Sincronización directa con GitHub
- Ideal para equipos

---

### Opción 2: Despliegue con CLI

**Instalación:**
```bash
npm install -g @railway/cli
```

**Paso a paso:**

1. **Inicializar proyecto**
```bash
railway init
```
Esto crea un nuevo proyecto vacío en Railway.

2. **Desplegar código**
```bash
railway up
```
Railway escanea tus archivos y los despliega automáticamente.

3. **Abrir proyecto**
```bash
railway open
```
Abre el proyecto en el dashboard.

**Ventajas:**
- Despliegue desde línea de comandos
- Control total sobre el proceso
- Ideal para desarrollo local
- Perfecto para CI/CD

**Otros comandos útiles:**
```bash
railway login          # Autenticarse
railway list           # Listar proyectos
railway logs           # Ver logs de aplicación
railway status         # Estado del despliegue
railway restart        # Reiniciar aplicación
railway redeploy       # Desplegar nuevamente
```

---

### Opción 3: Despliegue desde Imagen Docker

**Registries soportados:**
- Docker Hub
- GitHub Container Registry (ghcr.io)
- RedHat Container Registry (quay.io)
- GitLab Container Registry

**Pasos:**

1. **Crear proyecto vacío**
   - Dashboard → New Project
   - Selecciona "Empty project"

2. **Agregar servicio Docker**
   - Click en "Add a Service"
   - Selecciona "Docker Image"

3. **Especificar imagen**
   - Para Docker Hub: `usuario/imagen:tag`
   - Para otros registries: URL completa
   - Ejemplo: `ghcr.io/usuario/imagen:latest`

4. **Configurar credenciales (si es privada)**
   - Requiere plan Pro
   - Proporciona credenciales en service settings

**Ventajas:**
- Reutilizar imágenes existentes
- Control total sobre la construcción
- Compatibilidad con pipelines CI/CD

---

## Configuración de Servicios

### Variables de Entorno

```
VARIABLE_NAME = valor
DATABASE_URL = postgresql://user:pass@host/db
API_KEY = tu_clave_secreta
NODE_ENV = production
```

**Tipos de variables:**
- **Configuración**: URLs, puertos, modos
- **Secretos**: API keys, contraseñas
- **Variables de referencia**: `${{ServiceName.RAILWAY_PUBLIC_DOMAIN}}`

### Comandos de Build y Start

**Build Command** (compilación):
```bash
npm install && npm run build
```

**Start Command** (inicio):
```bash
npm start
npm run dev
node server.js
```

### Ejemplo - Express
```bash
# Build
npm install

# Start
npm start
```

---

## Networking

### Red Privada
Comunicación interna entre servicios sin exponerlos públicamente.

**Ventajas:**
- Mayor seguridad
- Sin costos de salida (egress)
- Mejor rendimiento

**Uso:**
```bash
# Variable privada
RAILWAY_PRIVATE_DOMAIN = miservicio.railway.internal
```

### Red Pública
Acceso desde internet a tu aplicación.

**Generar dominio de Railway:**
- Service Settings → Networking → "Generate Public Domain"
- Obtienes: `nombre-proyecto-xxxxx.railway.app`

**Dominio personalizado:**
- Service Settings → Networking → "Add Custom Domain"

---

## Bases de Datos

Railway soporta varias bases de datos:

### MongoDB
```
- Servicio "MongoDB"
- Connection string en variables
```

**Mejor práctica:**
Usa variables de referencia para conectar tu app a la base de datos:
```
DATABASE_URL = ${{Postgres.DATABASE_URL}}
```

---

## Mejores Prácticas

### 1. Usa Red Privada Cuando Sea Posible
```
✅ CORRECTO: RAILWAY_PRIVATE_DOMAIN
❌ EVITAR: RAILWAY_PUBLIC_DOMAIN (para servicios internos)
```

### 2. Agrupa Servicios Relacionados
- Aplicación + Base de datos = Mismo proyecto
- Reduce clutter en el dashboard
- Facilita variable sharing
- Sin costos de egress

### 3. Usa Variables de Referencia
```
# Dinámicas - se actualizan automáticamente
VITE_BACKEND_HOST = ${{Backend.RAILWAY_PUBLIC_DOMAIN}}
DATABASE_URL = ${{Postgres.DATABASE_URL}}

# Vs. hardcodeadas
# ❌ BACKEND_HOST = "https://mi-dominio.railway.app"
```

### 4. Monitorea Logs
En caso de errores:
- Revisa los logs completos (a veces el error está arriba)
- Checks automáticos verifican salud de la app
- Configura health checks personalizados

### 5. Usa Plantillas (Templates)
Railway ofrece +650 plantillas pre-configuradas:
- Umami (Analytics)
- Metabase (BI)
- Strapi (Headless CMS)
- Cal.com (Calendaring)

---

## Observabilidad

### Logs
Visualiza logs de:
- Build (construcción)
- Deploy (despliegue)
- Runtime (ejecución)

**Acceso:**
- Service → Logs
- Rails CLI: `railway logs`

### Métricas
Monitorea:
- **CPU**: Uso del procesador
- **Memoria**: Consumo de RAM
- **Red**: Ancho de banda

**Acceso:**
- Service → Metrics
- Customizable en dashboard de observabilidad

### Webhooks
Recibe notificaciones de eventos:
- Despliegues completados
- Fallos de compilación
- Cambios de estado

---

## Guía Paso a Paso: Desplegar tu Primera App

### Requisito: Tener una app en GitHub

### Caso 1: Desplegar desde GitHub

**1. Ir a Railway**
   - URL: https://railway.com
   - Login con GitHub

**2. Crear proyecto**
   - Click en "New Project"
   - Selecciona "GitHub repo"

**3. Seleccionar repositorio**
   - Autentica si es necesario
   - Busca tu repositorio
   - Click para seleccionar

**4. Elegir opción**
   - "Deploy Now" → Despliegue inmediato
   - "Add variables" → Configurar primero (si necesitas)

**5. Esperar despliegue**
   - Visualiza el Project Canvas
   - Verifica logs en "Deployments"
   - Cuando esté verde = ¡Éxito!

**6. Obtener dominio**
   - Service → Settings
   - Click en "Generate Domain"
   - Accede a `https://tu-app.railway.app`

---

### Caso 2: Desplegar con CLI

**1. Instalar CLI**
```bash
npm install -g @railway/cli
```

**2. Navegar a tu proyecto**
```bash
cd mi-proyecto
```

**3. Inicializar Railway**
```bash
railway init
```
- Nombre del proyecto: `Mi Aplicación`
- Se crea en Railway

**4. Desplegar**
```bash
railway up
```
- Railway detecta el framework
- Construye e despliega automáticamente

**5. Abrir dashboard**
```bash
railway open
```

**6. Configurar dominio público**
- En dashboard → Service Settings → Networking
- Generate Domain o agregar personalizado

---

## Configuración de Ejemplo: App Next.js

### 1. Variables de entorno (.env.local localmente)
```
NEXT_PUBLIC_API_URL=https://api.ejemplo.com
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=mi-clave-secreta
```

### 2. En Railway
```
Sistema automático detecta:
- next.json o package.json
- Build: npm run build
- Start: npm start
```

### 3. Conectar a Database
- Agregar servicio PostgreSQL al proyecto
- En variables, referenciar:
  ```
  DATABASE_URL = ${{Postgres.DATABASE_URL}}
  ```

### 4. Personalizar si necesario
- Custom Build: `npm install && npm run build`
- Custom Start: `npm start`

---

## Troubleshooting Común

| Problema | Causa | Solución |
|----------|-------|----------|
| No encontró comando start | Framework no detectado | Configura custom start command |
| Error de conexión a BD | Red incorrecta | Usa RAILWAY_PRIVATE_DOMAIN |
| Despliegue lento | Compilación pesada | Optimiza dependencias |
| Port binding error | Puerto ya in uso | Configura PORT en variables |
| Variable no encontrada | Referencia incorrecta | Verifica sintaxis `${{Service.VAR}}` |

---

## Próximos Pasos

1. **Explorar Entornos (Environments)**
   - Crea dev, staging, production
   - Despliegues automáticos por rama

2. **Variables de Referencia**
   - Aprende a sincronizar entre servicios

3. **Escalabilidad**
   - Aumenta recursos (CPU, RAM)
   - Configuración de réplicas

4. **Certificados SSL**
   - Dominios personalizados automáticamente
   - HTTPS por defecto

5. **Integración CI/CD**
   - GitHub Actions
   - Auto-deploys en cada push

---

## Recursos Útiles

- **Documentación Oficial**: https://docs.railway.com
- **Discord Community**: https://discord.gg/railway
- **Templates**: https://railway.com/templates
- **Status**: https://railway.com/status

---

## Resumen

**Railway simplifica el despliegue:**
1. ✅ Conecta tu GitHub o usa CLI
2. ✅ Railway detecta automáticamente tu app
3. ✅ Despliega en muchos segundos
4. ✅ Dashboard para monitoreo
5. ✅ Escala según necesites

**¡Ahora estás listo para desplegar en producción! 🚀**
