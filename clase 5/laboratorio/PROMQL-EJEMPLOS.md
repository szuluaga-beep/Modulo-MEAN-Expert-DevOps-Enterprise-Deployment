# Ejemplos de Consultas PromQL

## Consultas Básicas

### Ver una métrica
```promql
http_requests_total
```

### Filtrar por label
```promql
http_requests_total{status_code="200"}
```

### Múltiples condiciones
```promql
http_requests_total{status_code="200", method="GET"}
```

### Usar operador de != (diferente)
```promql
http_requests_total{status_code!="200"}
```

## Tasas (Rate)

### Tasa de cambio (requests por segundo)
```promql
rate(http_requests_total[1m])
```

### Tasa de errores
```promql
rate(http_request_errors_total[5m])
```

### Error rate en porcentaje
```promql
(rate(http_request_errors_total[5m]) / rate(http_requests_total[5m])) * 100
```

## Histogramas (Latencia)

### Percentil 50 (P50/Mediana)
```promql
histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))
```

### Percentil 95 (P95)
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### Percentil 99 (P99)
```promql
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
```

### Máximo de latencia en los últimos 5 minutos
```promql
max(rate(http_request_duration_seconds_bucket[5m]))
```

## Promedios

### Duración promedio de requests
```promql
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])
```

### Promedio de queries a BD
```promql
rate(database_query_duration_seconds_sum{operation="SELECT"}[5m]) 
/ rate(database_query_duration_seconds_count{operation="SELECT"}[5m])
```

## Aggregation (Agregación)

### Suma de requests por método
```promql
sum by (method) (rate(http_requests_total[5m]))
```

### Suma de requests por status code
```promql
sum by (status_code) (rate(http_requests_total[5m]))
```

### Promedio por todas las instancias
```promql
avg(rate(http_requests_total[5m]))
```

### Máximo por instancia
```promql
max by (instance) (app_memory_usage_bytes)
```

## Operaciones Matemáticas

### Convertir bytes a GB
```promql
app_memory_usage_bytes / (1024 * 1024 * 1024)
```

### Convertir porcentaje a 0-1
```promql
app_cpu_usage_percent / 100
```

### Diferencia entre dos métricas
```promql
http_requests_total - http_request_errors_total
```

## Funciones Útiles

### Aumento en el tiempo
```promql
increase(http_requests_total[1h])
```

### Máximo en el rango
```promql
max_over_time(http_request_duration_seconds_bucket[5m])
```

### Mínimo en el rango
```promql
min_over_time(app_cpu_usage_percent[5m])
```

### Promedio en el rango
```promql
avg_over_time(app_memory_usage_bytes[5m])
```

### Derivada (cambio por segundo)
```promql
deriv(http_requests_total[5m])
```

## Consultas Complejas

### Top 5 rutas más lentas
```promql
topk(5, histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])))
```

### Alertar si latencia se duplicó
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[2m]))
>
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[10m] offset 8m)) * 2
```

### % de disponibilidad (uptime)
```promql
(count(up{job="nodejs-app"} == 1) / count(up{job="nodejs-app"})) * 100
```

### Combinación de múltiples condiciones
```promql
histogram_quantile(0.95, 
  sum by (le, route) 
    (rate(http_request_duration_seconds_bucket{status_code="200"}[5m]))
)
```

## Consultas por Tabla de BD

### Duración promedio por tabla
```promql
{database_query_duration_seconds_sum} / {database_query_duration_seconds_count}
```

### Queries más lentas
```promql
topk(10, histogram_quantile(0.95, rate(database_query_duration_seconds_bucket[5m])))
```

## Métricas del Sistema (Node Exporter)

### CPU usage (%)
```promql
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

### Memoria disponible (%)
```promql
(node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100
```

### Uso de disco (%)
```promql
(1 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100
```

### Temperatura del sistema
```promql
node_hwmon_temp_celsius
```

### Uptime en días
```promql
node_boot_time_seconds
```

## Tips y Trucos

### Usar alias en queries
```promql
http_requests_total as http_req_total
```

### Comparar métodos HTTP
```promql
{__name__=~"http_request_duration_seconds_bucket", method="GET"}
```

### Buscar todas las métricas que contienen "cpu"
```promql
{__name__=~".*cpu.*"}
```

### Ignorar instancias específicas
```promql
http_requests_total{instance!="localhost:3000"}
```

### Regex en labels
```promql
http_requests_total{route=~"/api/.*"}
```

---

## Para usar en Dashboards de Grafana

### Panel 1: Requests por segundo
```promql
sum(rate(http_requests_total[1m])) by (status_code)
```
Tipo: Graph or Bar chart

### Panel 2: Latencia P95
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```
Tipo: Stat or Gauge

### Panel 3: Error rate
```promql
(sum(rate(http_request_errors_total[5m])) / sum(rate(http_requests_total[5m]))) * 100
```
Tipo: Gauge

### Panel 4: Uso de memoria
```promql
app_memory_usage_bytes / (1024*1024*1024)
```
Tipo: Graph

### Panel 5: CPU de la app
```promql
app_cpu_usage_percent
```
Tipo: Gauge

### Panel 6: Duración queries BD
```promql
histogram_quantile(0.95, rate(database_query_duration_seconds_bucket[5m]))
```
Tipo: Stat

---

¡Experimenta con estas queries en Prometheus y crea tus propios dashboards! 📊
