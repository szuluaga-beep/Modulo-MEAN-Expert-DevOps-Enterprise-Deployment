# Clase 5: Monitorización y Logging con Prometheus y Grafana

## Introducción

La monitorización y el logging son componentes críticos en cualquier infrastructura de producción. Permiten detectar problemas, entender el comportamiento de las aplicaciones y tomar decisiones informadas sobre optimizaciones.

### ¿Por qué es importante?
- **Visibilidad**: Conocer el estado en tiempo real de tus aplicaciones
- **Detección proactiva**: Identificar problemas antes de que afecten a los usuarios
- **Debugging**: Analizar logs para entender qué sucedió en errores
- **Optimización**: Usar métricas para mejorar rendimiento
- **Compliance**: Cumplir con requisitos de auditoría

---

## Conceptos Fundamentales

### 1. Monitorización vs Logging

**Monitorización (Monitoring)**
- Recopila métricas numéricas
- Proporciona visión del estado actual
- Enfoque en tendencias y alertas
- Herramientas: Prometheus, Datadog, New Relic

**Logging**
- Registra eventos y errores detallados
- Proporciona contexto histórico
- Enfoque en investigación
- Herramientas: ELK Stack, Splunk, CloudWatch

### 2. Tipos de Métricas

**Métrica (Gauge)**
- Valor que puede aumentar o disminuir
- Ejemplo: Uso de CPU, temperatura

**Contador (Counter)**
- Valor que solo aumenta
- Se resetea al reiniciar el servicio
- Ejemplo: Total de requests

**Histograma (Histogram)**
- Agrupa valores en buckets
- Calcula percentiles
- Ejemplo: Latencia de requests

**Resumen (Summary)**
- Similar a histograma pero con percentiles
- Calculados en el cliente
- Ejemplo: Duración de operaciones

---

## Prometheus

### ¿Qué es Prometheus?

Prometheus es un sistema de monitorización de código abierto que:
- Recopila métricas mediante polling
- Almacena datos en series de tiempo (TSDB)
- Proporciona lenguaje de consulta PromQL
- Genera alertas basadas en reglas

### Arquitectura

```
Aplicaciones (Exporters)
        ↓
  [Prometheus Server]
  - Scraper (recopila métricas)
  - TSDB (almacena datos)
  - PromQL (query engine)
        ↓
    [Alertmanager]
  (gestiona alertas)
```

### Instalación y Configuración

#### 1. Con Docker

```yaml
# docker-compose.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

volumes:
  prometheus_data:
```

#### 2. Archivo de Configuración

```yaml
# prometheus.yml
global:
  scrape_interval: 15s  # Intervalo de recopilación
  evaluation_interval: 15s  # Intervalo de evaluación de alertas

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'nodejs-app'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']
```

### Exporters

Los exporters son agentes que exponen métricas en formato Prometheus.

**Node Exporter** (sistema operativo)
```bash
docker run -d \
  --name=node-exporter \
  -p 9100:9100 \
  prom/node-exporter:latest
```

**Client Libraries** (aplicaciones)

En Node.js con Prom Client:

```javascript
const express = require('express');
const promClient = require('prom-client');

const app = express();

// Crear métricas
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware para registrar métricas
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
  });
  
  next();
});

// Endpoint de métricas
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Rutas de ejemplo
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Consultas PromQL

**Sintaxis básica**
```
# Métrica actual
http_requests_total

# Con filtro
http_requests_total{job="nodejs-app"}

# Con operador
http_requests_total{status_code="200"}

# Rango de tiempo
http_requests_total[5m]
```

**Funciones útiles**
```
# Tasa de cambio en 5 minutos
rate(http_requests_total[5m])

# Promedio en 5 minutos
avg_over_time(http_requests_total[5m])

# Máximo en 5 minutos
max_over_time(http_requests_total[5m])

# Percentil (para histogramas)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

---

## Grafana

### ¿Qué es Grafana?

Grafana es una plataforma de visualización que permite:
- Crear dashboards personalizados
- Conectar múltiples fuentes de datos
- Configurable alertas
- Ver métricas históricas

### Instalación

#### 1. Con Docker

```yaml
# docker-compose.yml
version: '3.8'

services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus

volumes:
  grafana_data:
```

#### 2. Acceso Inicial

- URL: `http://localhost:3000`
- Usuario: `admin`
- Contraseña: `admin`

### Configuración de Prometheus como Data Source

1. **Ir a Configuration → Data Sources**
2. **Click en "Add data source"**
3. **Seleccionar Prometheus**
4. **Configurar:**
   - URL: `http://prometheus:9090`
   - Nombre: `Prometheus`
5. **Save & test**

### Creación de Dashboards

#### 1. Dashboard básico

1. **Click en "+" → "Dashboard"**
2. **Add new panel**
3. **En Query, seleccionar Prometheus**
4. **Escribir PromQL:**
   ```
   rate(http_requests_total[5m])
   ```
5. **Visualization: Graph**
6. **Save**

#### 2. Paneles comunes

**Request Rate (Tasa de solicitudes)**
```
rate(http_requests_total[1m])
```
Visualización: Graph with legend

**Error Rate**
```
rate(http_requests_total{status_code=~"5.."}[1m])
```
Visualización: Gauge

**Latencia P95**
```
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```
Visualización: Stat

**CPU Usage**
```
100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```
Visualización: Graph

### Alertas en Grafana

#### 1. Crear regla de alerta

1. **Editar panel**
2. **Tab "Alert"**
3. **Click "Create Alert"**
4. **Configurar condición:**
   ```
   when: last()
   of: query A
   is: above (valor)
   for: 5 minutes
   ```

#### 2. Configurar notificaciones

1. **Alerting → Notification channels**
2. **"New channel"**
3. Seleccionar tipo: Email, Slack, PagerDuty, etc.
4. Configurar detalles
5. Save

---

## Stack Completo de Monitorización

### Docker Compose completo

```yaml
version: '3.8'

services:
  # Aplicación Node.js
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - prometheus

  # Prometheus
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'

  # Node Exporter
  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'

  # Grafana
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus

  # Alertmanager
  alertmanager:
    image: prom/alertmanager:latest
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml

volumes:
  prometheus_data:
  grafana_data:
```

### Configuración de Alertas

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'cluster']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'critical'
    - match:
        severity: warning
      receiver: 'default'

receivers:
  - name: 'default'
    email_configs:
      - to: 'admin@example.com'
        from: 'alerts@example.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'your-email@gmail.com'
        auth_password: 'your-password'

  - name: 'critical'
    email_configs:
      - to: 'oncall@example.com'
        from: 'alerts@example.com'

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'cluster']
```

```yaml
# prometheus.yml - Agregar reglas
global:
  scrape_interval: 15s

rule_files:
  - 'alert_rules.yml'

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

# ... resto de configuración
```

```yaml
# alert_rules.yml
groups:
  - name: application
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} requests/sec"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        annotations:
          summary: "High latency detected"
          description: "P95 latency is {{ $value }} seconds"

      - alert: HighCPU
        expr: 100 - (avg(irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is {{ $value }}%"
```

---

## Mejores Prácticas

### 1. Naming de Métricas
```
# Formato: <namespace>_<subsystem>_<nombre>_<unidad>
http_request_duration_seconds
database_query_duration_milliseconds
memory_usage_bytes
```

### 2. Labels
```javascript
// ✅ Bueno
http_requests_total{method="GET", endpoint="/api/users", status="200"}

// ❌ Malo - demasiados labels con alta cardinalidad
http_requests_total{user_id="12345"}
```

### 3. Retención de Datos
```yaml
# Configurar en prometheus.yml
--storage.tsdb.retention.time=30d
--storage.tsdb.retention.size=50GB
```

### 4. Alertas Significativas
```yaml
# ✅ Bueno - alerta accionable
- alert: DatabaseConnectionPoolExhausted
  expr: db_connection_pool_available < 1
  
# ❌ Malo - demasiados falsos positivos
- alert: AnyErrorOccurred
  expr: rate(errors_total[1m]) > 0
```

### 5. Dashboards Enfocados
- Dashboard por aplicación
- Dashboard por contexto (performance, errores, infraestructura)
- Mantener simple y legible

---

## Troubleshooting Común

### 1. Prometheus no recopila métricas
- Verificar conectividad: `curl http://app:3000/metrics`
- Revisar logs: `docker logs prometheus`
- Validar formato YAML en prometheus.yml

### 2. Grafana no ve datos
- Verificar datasource está funcionando
- Probar PromQL en Prometheus directamente
- Revisar intervalos de scrape

### 3. Alertas no se envían
- Verificar alertmanager está activo
- Revisar configuración SMTP
- Probar con `amtool` (herramienta CLI)

---

## Recursos Adicionales

- Documentación Prometheus: https://prometheus.io/docs
- Documentación Grafana: https://grafana.com/docs
- PromQL tutorial: https://prometheus.io/docs/prometheus/latest/querying/basics
- Prom Client (Node.js): https://github.com/siimon/prom-client

---

## Resúmen

En esta clase aprendimos:
- ✅ Conceptos de monitorización y logging
- ✅ Prometheus como sistema de métricas
- ✅ Grafana para visualización
- ✅ Configuración de alertas
- ✅ Stack completo de monitorización
- ✅ Mejores prácticas

La monitorización es fundamental para mantener aplicaciones en producción confiables y resilientes.
