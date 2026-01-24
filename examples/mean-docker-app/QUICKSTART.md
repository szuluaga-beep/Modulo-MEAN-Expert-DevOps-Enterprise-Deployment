# Guía Rápida de Inicio - MEAN Stack con Docker

Este archivo contiene comandos rápidos para comenzar con el ejemplo de Docker MEAN Stack.

## 🚀 Inicio Rápido (5 minutos)

```bash
# 1. Navegar al directorio del ejemplo
cd examples/mean-docker-app

# 2. Construir e iniciar todos los servicios
docker-compose up -d

# 3. Esperar a que los servicios estén listos (aproximadamente 30 segundos)
docker-compose ps

# 4. Verificar logs
docker-compose logs -f
```

## ✅ Verificación de Funcionamiento

### Verificar el Backend

```bash
# Test de salud del backend
curl http://localhost:3000/api/health

# Respuesta esperada:
# {"status":"OK","message":"Backend funcionando correctamente","timestamp":"..."}
```

### Probar la API REST

```bash
# Crear un usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"María García","email":"maria@example.com"}'

# Listar todos los usuarios
curl http://localhost:3000/api/users

# Salida esperada: Array JSON con los usuarios
```

### Verificar MongoDB

```bash
# Conectar a MongoDB desde el contenedor
docker-compose exec mongodb mongosh -u admin -p secret123 --authenticationDatabase admin

# Dentro de mongosh, ejecutar:
# use meandb
# db.users.find().pretty()
# exit
```

### Acceder al Frontend

```bash
# Abrir en el navegador
# http://localhost

# O usando curl
curl http://localhost
```

## 📊 Monitoreo

```bash
# Ver el estado de todos los contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs mongodb
docker-compose logs frontend

# Ver uso de recursos
docker stats
```

## 🔧 Comandos Útiles

### Modo Desarrollo

Para trabajar con hot-reload (recarga automática):

```bash
# Usar el archivo de compose para desarrollo
docker-compose -f docker-compose.dev.yml up -d

# Ver logs del backend en desarrollo
docker-compose -f docker-compose.dev.yml logs -f backend

# Los cambios en ./backend se reflejarán automáticamente
```

### Reiniciar Servicios

```bash
# Reiniciar todos los servicios
docker-compose restart

# Reiniciar un servicio específico
docker-compose restart backend
```

### Reconstruir Después de Cambios en el Código

```bash
# Reconstruir y reiniciar
docker-compose up -d --build

# Reconstruir solo el backend
docker-compose build backend
docker-compose up -d backend
```

### Acceder a los Contenedores

```bash
# Ejecutar shell en el backend
docker-compose exec backend sh

# Ejecutar shell en MongoDB
docker-compose exec mongodb mongosh

# Ejecutar shell en el frontend (Nginx)
docker-compose exec frontend sh
```

### Ver Configuración

```bash
# Ver la configuración compilada de docker-compose
docker-compose config

# Ver las redes creadas
docker network ls | grep mean

# Ver los volúmenes creados
docker volume ls | grep mean
```

## 🛑 Detener y Limpiar

```bash
# Detener los servicios (mantiene los datos)
docker-compose stop

# Detener y eliminar contenedores (mantiene los datos)
docker-compose down

# Detener, eliminar contenedores Y eliminar volúmenes (elimina los datos)
docker-compose down -v

# Limpiar todo el sistema Docker (usar con precaución)
docker system prune -a --volumes
```

## 🐛 Solución de Problemas

### Problema: Puerto ya en uso

```bash
# Verificar qué proceso está usando el puerto
sudo lsof -i :3000
# o
sudo netstat -tulpn | grep 3000

# Solución 1: Detener el proceso que usa el puerto
# Solución 2: Cambiar el puerto en docker-compose.yml
# ports:
#   - "3001:3000"
```

### Problema: Contenedor se reinicia constantemente

```bash
# Ver los logs para identificar el error
docker-compose logs backend

# Ver el estado detallado
docker-compose ps
```

### Problema: No hay conexión entre contenedores

```bash
# Verificar que todos los contenedores estén en la misma red
docker network inspect mean-docker-app_mean-network

# Verificar conectividad desde el backend a MongoDB
docker-compose exec backend ping mongodb
```

### Problema: Los cambios no se reflejan

```bash
# Reconstruir sin caché
docker-compose build --no-cache
docker-compose up -d

# Verificar que el código se haya copiado correctamente
docker-compose exec backend ls -la
```

## 📝 Pruebas Completas de la API

```bash
#!/bin/bash
# test-api.sh - Script de prueba de la API

echo "🔍 Testing MEAN Stack API..."
echo ""

# Test 1: Health check
echo "1. Health Check:"
curl -s http://localhost:3000/api/health | jq
echo ""

# Test 2: Crear usuario 1
echo "2. Creando usuario 1..."
curl -s -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez","email":"juan@example.com"}' | jq
echo ""

# Test 3: Crear usuario 2
echo "3. Creando usuario 2..."
curl -s -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana López","email":"ana@example.com"}' | jq
echo ""

# Test 4: Listar todos los usuarios
echo "4. Listando todos los usuarios:"
curl -s http://localhost:3000/api/users | jq
echo ""

echo "✅ Pruebas completadas!"
```

Para ejecutar el script:

```bash
# Hacer ejecutable
chmod +x test-api.sh

# Ejecutar
./test-api.sh
```

## 📚 Recursos Adicionales

- **Documentación de Docker**: https://docs.docker.com/
- **Docker Compose Reference**: https://docs.docker.com/compose/
- **MongoDB Docker**: https://hub.docker.com/_/mongo
- **Node.js Docker**: https://hub.docker.com/_/node
- **Nginx Docker**: https://hub.docker.com/_/nginx

## 💡 Próximos Pasos

1. Agregar autenticación con JWT
2. Implementar validaciones en el backend
3. Crear el frontend Angular completo
4. Agregar tests automatizados
5. Configurar CI/CD
6. Desplegar en la nube

## 🎓 Ejercicios Propuestos

1. **Modificar el backend**: Agregar un nuevo endpoint para actualizar usuarios
2. **Personalizar MongoDB**: Cambiar las credenciales y agregar más datos iniciales
3. **Optimizar imágenes**: Reducir el tamaño de las imágenes Docker
4. **Agregar Redis**: Incluir Redis para caché
5. **Configurar HTTPS**: Agregar certificados SSL con Let's Encrypt

---

¿Preguntas o problemas? Revisa la documentación completa en el archivo README.md principal.
