# Pruebas de Carga y Estrés en Aplicaciones MEAN

## ¿Qué son las pruebas de carga y estrés?

- **Pruebas de Carga**: Evalúan el rendimiento bajo una carga esperada
- **Pruebas de Estrés**: Determinan el punto de ruptura del sistema

## Importancia en MEAN

Las aplicaciones MEAN deben pruebase para:
- Identificar cuellos de botella en Node.js, MongoDB y Express
- Validar capacidad de escalado
- Asegurar disponibilidad bajo picos de tráfico
- Optimizar recursos del servidor

## Herramientas Populares

| Herramienta | Uso |
|---|---|
| **Apache JMeter** | Pruebas complejas multihilo |
| **LoadRunner** | Pruebas empresariales |
| **Gatling** | Pruebas de estrés en Scala |
| **K6** | Pruebas modernas y escalables |
| **Artillery** | Pruebas API simplificadas |
| **Locust** | Pruebas Python con muchos usuarios |

## Prueba Básica con Artillery

```bash
# Instalar
npm install -g artillery

# Crear archivo load-test.yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Cargar API"
    flow:
      - get:
          url: "/api/users"
      - post:
          url: "/api/data"
          json:
            name: "test"

# Ejecutar
artillery run load-test.yml
```

## Métricas Clave

- **Response Time**: Tiempo de respuesta promedio
- **Throughput**: Solicitudes por segundo
- **Error Rate**: Porcentaje de fallos
- **CPU/Memoria**: Uso de recursos
- **P95/P99**: Percentiles de latencia

## Optimización Post-Prueba

1. Implementar caché en MongoDB (índices)
2. Usar clustering en Node.js
3. Optimizar consultas con agregación
4. Implementar load balancing
5. Aumentar recursos del servidor

## Mejores Prácticas

✓ Pruebas en ambiente similar a producción  
✓ Realizar pruebas periódicas  
✓ Monitorear durante las pruebas  
✓ Documentar resultados baseline  
✓ Escalado gradual de usuarios  
✓ Validar bajo condiciones reales
