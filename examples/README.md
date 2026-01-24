# Ejemplos de Docker para Stack MEAN

Este directorio contiene ejemplos prácticos de la Clase 2 sobre creación de imágenes Docker para aplicaciones MEAN.

⚠️ **Aviso de Seguridad**: Estos ejemplos usan versiones con parches de seguridad aplicados. Las dependencias se actualizan regularmente. Siempre ejecuta `npm audit` y actualiza a las últimas versiones estables antes de usar en producción.

## Estructura del Proyecto

```
mean-docker-app/
├── backend/                  # Backend con Node.js y Express
│   ├── Dockerfile           # Multi-stage Dockerfile para el backend
│   ├── package.json         # Dependencias del backend
│   └── server.js            # Servidor Express con API REST
├── frontend/                 # Frontend con Angular
│   ├── Dockerfile           # Multi-stage Dockerfile para el frontend
│   ├── nginx.conf           # Configuración de Nginx
│   └── package.json         # Dependencias del frontend
├── docker-compose.yml       # Orquestación de todos los servicios
├── init-mongo.js            # Script de inicialización de MongoDB
└── .dockerignore            # Archivos a excluir del contexto Docker
```

## Componentes del Stack

### MongoDB
- Imagen oficial de MongoDB 7.0
- Puerto: 27017
- Usuario: admin / secret123
- Base de datos: meandb
- Volumen persistente para datos

### Backend (Node.js + Express)
- API REST con Express
- Conexión a MongoDB con Mongoose
- Endpoints disponibles:
  - `GET /api/health` - Estado del servicio
  - `GET /api/users` - Listar usuarios
  - `POST /api/users` - Crear usuario
  - `DELETE /api/users/:id` - Eliminar usuario
- Puerto: 3000

### Frontend (Angular + Nginx)
- Aplicación Angular compilada
- Servida con Nginx
- Proxy reverso configurado para el backend
- Puerto: 80

## Uso Rápido

### Prerrequisitos
- Docker instalado (versión 20.10 o superior)
- Docker Compose instalado (versión 2.0 o superior)

### Iniciar la Aplicación

```bash
# Navegar al directorio del ejemplo
cd examples/mean-docker-app

# Construir e iniciar todos los servicios
docker-compose up -d

# Ver los logs
docker-compose logs -f

# Ver el estado de los contenedores
docker-compose ps
```

### Verificar el Funcionamiento

```bash
# Verificar el estado del backend
curl http://localhost:3000/api/health

# Crear un usuario de prueba
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez","email":"juan@example.com"}'

# Listar todos los usuarios
curl http://localhost:3000/api/users

# Acceder al frontend
# Abrir en el navegador: http://localhost
```

### Detener la Aplicación

```bash
# Detener los servicios
docker-compose down

# Detener y eliminar volúmenes (datos)
docker-compose down -v
```

## Modo Desarrollo

Para trabajar en modo desarrollo con recarga automática:

```bash
# Iniciar solo el backend en modo desarrollo
docker-compose run --rm -p 3000:3000 backend npm run dev

# Iniciar el frontend localmente (fuera de Docker)
cd frontend
npm install
npm start
```

## Comandos Útiles

### Construcción
```bash
# Reconstruir las imágenes
docker-compose build

# Reconstruir sin caché
docker-compose build --no-cache

# Construir solo un servicio
docker-compose build backend
```

### Inspección
```bash
# Ver logs de un servicio específico
docker-compose logs backend

# Ejecutar comandos en un contenedor
docker-compose exec backend sh
docker-compose exec mongodb mongosh

# Ver uso de recursos
docker stats
```

### Limpieza
```bash
# Eliminar contenedores detenidos
docker-compose rm

# Limpiar imágenes no usadas
docker image prune

# Limpiar todo el sistema
docker system prune -a --volumes
```

## Personalización

### Variables de Entorno

Puedes crear un archivo `.env` en el directorio raíz:

```env
# MongoDB
MONGO_USERNAME=admin
MONGO_PASSWORD=secret123
MONGO_DATABASE=meandb

# Backend
NODE_ENV=production
PORT=3000

# Puertos
MONGO_PORT=27017
BACKEND_PORT=3000
FRONTEND_PORT=80
```

### Modificar la Configuración

Edita `docker-compose.yml` para ajustar:
- Puertos expuestos
- Variables de entorno
- Volúmenes
- Redes
- Health checks

## Mejores Prácticas Aplicadas

1. **Multi-stage builds**: Reduce el tamaño de las imágenes finales
2. **Imágenes Alpine**: Imágenes base ligeras y seguras
3. **Health checks**: Verificación automática del estado de los servicios
4. **Usuario no-root**: Mayor seguridad en producción
5. **Caché de dependencias**: Optimización de tiempos de build
6. **Volúmenes**: Persistencia de datos de MongoDB
7. **Redes**: Aislamiento de servicios
8. **Nginx optimizado**: Compresión, caché y seguridad

## Auditoría de Seguridad

### Verificar Vulnerabilidades

```bash
# Auditar dependencias del backend
cd backend
npm audit

# Auditar dependencias del frontend
cd frontend
npm audit

# Ver detalles completos
npm audit --json

# Aplicar fixes automáticos (cuando sea posible)
npm audit fix
```

### Escanear Imágenes Docker

```bash
# Usando Docker Scout (incluido en Docker Desktop)
docker scout cves mean-backend:latest

# Usando Trivy
trivy image mean-backend:latest
trivy image mean-frontend:latest
trivy image mongo:7.0

# Escanear todas las imágenes
docker images --format "{{.Repository}}:{{.Tag}}" | xargs -I {} trivy image {}
```

### Mantener Dependencias Actualizadas

```bash
# Ver versiones disponibles
npm outdated

# Actualizar a versiones menores/patch
npm update

# Actualizar a versiones mayores (con precaución)
npx npm-check-updates -u
npm install
```

## Problemas Comunes

### Puerto en uso
```bash
# Cambiar el puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar puerto 3001 en lugar de 3000
```

### Problemas de permisos
```bash
# Dar permisos al directorio
sudo chown -R $USER:$USER .
```

### Contenedor no inicia
```bash
# Ver logs detallados
docker-compose logs backend

# Verificar configuración
docker-compose config
```

## Próximos Pasos

- Agregar autenticación JWT
- Implementar tests automatizados
- Configurar CI/CD con GitHub Actions
- Desplegar en Kubernetes
- Agregar monitoreo con Prometheus/Grafana

## Recursos

- [Documentación oficial de Docker](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Angular Docker Deployment](https://angular.io/guide/deployment)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
