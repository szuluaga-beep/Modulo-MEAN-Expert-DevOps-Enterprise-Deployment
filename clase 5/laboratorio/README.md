# 🔍 Laboratorio de Monitorización con Prometheus y Grafana

## ✨ ¿Qué incluye este laboratorio?

Un **stack completo de monitorización** listo para usar con Docker Compose que incluye:

- 🎯 **Aplicación Node.js** con métricas de Prometheus integradas
- 🟡 **Prometheus** para recopilación de métricas
- 📊 **Grafana** para visualización y dashboards
- 🔔 **Alertmanager** para gestión de alertas
- 📈 **Node Exporter** para métricas del sistema operativo

### Comandos Docker Compose directos

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## 🌐 Acceso Inmediato

| Herramienta | URL | Usuario/Contraseña |
|-------------|-----|-------------------|
| **Aplicación** | http://localhost:3000 | - |
| **Prometheus** | http://localhost:9090 | - |
| **Grafana** | http://localhost:3001 | admin / admin |
| **Alertmanager** | http://localhost:9093 | - |

## 🎓 Estructura de Archivos

```
laboratorio/
├── docker-compose.yml       ← Orquestación de servicios
├── Dockerfile               ← Imagen de la aplicación
├── app.js                   ← Aplicación Node.js con métricas
├── package.json             ← Dependencias
├── prometheus.yml           ← Configuración de Prometheus
├── alert_rules.yml          ← Reglas de alertas
├── alertmanager.yml         ← Configuración de Alertmanager
├── grafana-datasources.yml  ← Datasources de Grafana
├── grafana-dashboards.yml   ← Config de dashboards
├── lab.sh                   ← Script para Linux/Mac
├── lab.ps1                  ← Script para Windows PowerShell
├── INSTRUCCIONES.md         ← Guía detallada
├── PROMQL-EJEMPLOS.md       ← Ejemplos de PromQL
└── README.md                ← Este archivo
```

## 📊 Primeros Pasos (5 minutos)

### 1. Ver la aplicación
```
Abre: http://localhost:3000
```

### 2. Ir a Grafana
```
Abre: http://localhost:3001
Usuario: admin
Contraseña: admin
```

### 3. Agregar Prometheus como datasource
- Ve a: **Configuration → Data Sources**
- Click en **"Add data source"**
- Selecciona **Prometheus**
- URL: `http://prometheus:9090`
- Click en **"Save & test"**

### 4. Crear tu primer panel
- Click en **"+" → Dashboard → New Dashboard**
- Click en **"Add new panel"**
- Copia esta query:
```promql
rate(http_requests_total[1m])
```
- Visualización: **Graph**
- Click en **Save**

### 5. Generar datos
En terminal:
```bash
./lab.sh load
# o en PowerShell:
.\lab.ps1 load
```

## 📈 Métricas Disponibles

**Contador (Counter):**
- `http_requests_total` - Total de requests
- `http_request_errors_total` - Total de errores

**Histograma (Histogram):**
- `http_request_duration_seconds` - Latencia de requests
- `database_query_duration_seconds` - Latencia de BD

**Gauge:**
- `app_memory_usage_bytes` - Uso de memoria
- `app_cpu_usage_percent` - Uso de CPU
- `app_active_connections` - Conexiones activas

## 🔥 Consultas PromQL Útiles

```promql
# Requests por segundo
rate(http_requests_total[1m])

# Latencia P95
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error rate
(rate(http_request_errors_total[5m]) / rate(http_requests_total[5m])) * 100

# Uso de memoria en GB
app_memory_usage_bytes / (1024*1024*1024)
```

Ver más ejemplos en [PROMQL-EJEMPLOS.md](PROMQL-EJEMPLOS.md)


## 📝 Endpoints de la App

| Endpoint | Descripción |
|----------|------------|
| `GET /` | Página principal |
| `GET /health` | Health check |
| `GET /api/users` | Lista de usuarios (con delay) |
| `GET /api/data` | Obtiene datos (con delay) |
| `GET /api/error` | Simula errores (30% probabilidad) |
| `GET /metrics` | Métricas Prometheus |

### Grafana no conecta
1. Ve a Configuration → Data Sources
2. Edita Prometheus
3. Verifica URL: `http://prometheus:9090`
4. Haz test

## 📚 Recursos Adicionales

- [Documentación Prometheus](https://prometheus.io/docs/)
- [Documentación Grafana](https://grafana.com/docs/)
- [PromQL Cheat Sheet](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Ejemplos PromQL](PROMQL-EJEMPLOS.md)
- [Guía Détallada](INSTRUCCIONES.md)


## 🏆 Lo que aprenderás

✅ Cómo configurar Prometheus
✅ Instrumentar una aplicación con métricas
✅ Crear dashboards en Grafana
✅ Escribir consultas PromQL
✅ Configurar alertas
✅ Monitorizar sistemas con Node Exporter
✅ Usar Docker Compose
✅ Mejores prácticas de monitorización

---

## 📞 Ayuda

1. Revisa [INSTRUCCIONES.md](INSTRUCCIONES.md) para guía detallada
2. Ve [PROMQL-EJEMPLOS.md](PROMQL-EJEMPLOS.md) para consultas

---

**¡Disfruta aprendiendo monitorización! 🎉**
