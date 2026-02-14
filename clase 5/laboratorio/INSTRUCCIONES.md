# Laboratorio de Monitorización con Prometheus y Grafana

## 📋 Descripción

Este laboratorio proporciona un stack completo de monitorización con:
- **Aplicación Node.js** con métricas de Prometheus
- **Prometheus** para recopilación de métricas
- **Grafana** para visualización
- **Node Exporter** para métricas del sistema
- **Alertmanager** para gestión de alertas

## 📁 Estructura de Archivos

```
laboratorio/
├── docker-compose.yml          # Configuración de servicios Docker
├── Dockerfile                  # Imagen de la app
├── app.js                      # Aplicación Node.js
├── package.json                # Dependencias
├── prometheus.yml              # Configuración de Prometheus
├── alert_rules.yml             # Reglas de alertas
├── alertmanager.yml            # Configuración de Alertmanager
├── grafana-datasources.yml     # Datasources de Grafana
├── grafana-dashboards.yml      # Configuración de dashboards
└── INSTRUCCIONES.md            # Este archivo
```

## 🚀 Requisitos

- Docker Desktop instalado
- Docker Compose (incluido en Docker Desktop)
- Mínimo 2GB de RAM disponible
- Puertos disponibles: 3000, 3001, 9090, 9093, 9100

## 🏗️ Instalación y Ejecución

### 1. Clonar o descargar el laboratorio

```bash
cd clase\ 5/laboratorio
```

### 2. Crear el contenedor de la aplicación

```bash
docker-compose up -d
```

Este comando va a:
- Construir la imagen Docker de la aplicación
- Descargar imágenes de Prometheus, Grafana, Node Exporter y Alertmanager
- Crear y ejecutar todos los contenedores
- Esperar a que la aplicación esté lista

### 3. Verificar que todo está funcionando

```bash
# Ver estado de los contenedores
docker-compose ps

# Ver logs de la aplicación
docker-compose logs -f app
```

## 🌐 Acceso a las Herramientas

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Aplicación | http://localhost:3000 | - |
| Prometheus | http://localhost:9090 | - |
| Grafana | http://localhost:3001 | admin / admin |
| Alertmanager | http://localhost:9093 | - |
| Node Exporter | http://localhost:9100 | - |

## 📊 Guía de Uso

### A. Ver métricas en Prometheus

1. Abre http://localhost:9090
2. En "Graph", busca una métrica:
   ```
   http_requests_total
   ```
3. Click en "Execute" para ver el gráfico
4. Cambia a "Graph" para visualizar mejor

### B. Consultas PromQL Que Funcionan

```promql
-- Total de requests (va en aumento)
http_requests_total

-- Total de errores
http_request_errors_total

-- Uso de memoria en bytes
app_memory_usage_bytes

-- Uso de CPU en porcentaje
app_cpu_usage_percent

-- Conexiones activas ahora
app_active_connections

-- Ratio de cache hits
cache_hit_ratio

-- Duración de requests HTTP (métrica de histograma)
http_request_duration_seconds

-- Status de la aplicación
up{job="nodejs-app"}
```

### C. Crear Dashboard en Grafana (Guía Detallada)

#### Paso 1: Acceder a Grafana

1. Abre tu navegador y ve a **http://localhost:3001**
2. Ingresa con las credenciales:
   - **Usuario:** `admin`
   - **Contraseña:** `admin`
3. Si es tu primer acceso, se te pedirá cambiar la contraseña (opcional, puedes omitir)

#### Paso 2: Crear un nuevo Dashboard

1. En la parte superior izquierda, haz click en el **+ (signo más)** o busca "Create"
2. Selecciona **Dashboard**
3. Haz click en **Create new dashboard**
4. Se abrirá un dashboard vacío

#### Paso 3: Agregar el Primer Panel - Total de Requests

1. Haz click en **Add → Add new panel**
2. Debajo de donde dice "Data source", asegúrate de seleccionar **Prometheus**
3. En la sección **Metrics**, ingresa esta query:
   ```promql
   http_requests_total
   ```
   - **Explicación:** Muestra el contador acumulativo de todos los requests HTTP
4. Click en **Execute** para ver datos

#### Paso 4: Configurar la Visualización - Gráfico de Línea

1. En el panel derecho, ve a la pestaña **Visualizations**
2. Selecciona **Time series** (es la opción por defecto)
3. En la sección **Panel options** (arriba):
   - **Title:** `Total de Requests HTTP`
4. Haz click en **Apply**

#### Paso 5: Agregar Segundo Panel - Uso de Memoria

1. Haz click en **Add → Add new panel**
2. Asegúrate de seleccionar **Prometheus**
3. En la sección **Metrics**, ingresa:
   ```promql
   app_memory_usage_bytes
   ```
   - **Explicación:** Usa actual de memoria en bytes
4. Click en **Execute**

#### Paso 6: Configurar Visualización - Gauge (medidor)

1. En **Visualizations**, selecciona **Gauge**
2. En **Panel options**, configura:
   - **Title:** `Uso de Memoria`
   - **Unit:** `bytes` (o elige uno que prefieras)
3. En **Gauge options**, puedes ajustar Min y Max
4. Haz click en **Apply**

#### Paso 7: Agregar Tercer y Último Panel - Conexiones Activas

1. Haz click en **Add → Add new panel**
2. Ingresa la query:
   ```promql
   app_active_connections
   ```
   - **Explicación:** Número de conexiones activas en este momento
3. Click en **Execute**

#### Paso 8: Configurar Visualización - Stat (número grande)

1. En **Visualizations**, selecciona **Stat**
2. En **Panel options**:
   - **Title:** `Conexiones Activas`
3. Haz click en **Apply**

#### Paso 9: Guardar el Dashboard

1. Una vez hayas agregado los tres paneles, haz click en el **botón de guardar** (arriba a la derecha)
2. Dale un nombre significativo, por ejemplo: `Monitoreo de Aplicación`
3. Haz click en **Save**

#### Paso 10: Organizar los Paneles (Opcional)

1. Puedes **arrastrar y soltar** los paneles para reorganizarlos
2. Haz click en el panel y **arrastra desde la esquina superior izquierda** para moverlo
3. Para **cambiar el tamaño**, arrastra desde la esquina inferior derecha del panel
4. Cuando termines, haz click en **Save** nuevamente

---

### Tipos de Visualizaciones Recomendadas

| Métrica | Tipo de Gráfico | Cuándo Usar |
|---------|-----------------|------------|
| Total de requests | Time series | Ver tendencia acumulada en el tiempo |
| Errores | Time series | Ver cuántos errores ocurrieron |
| Memoria/CPU | Gauge | Ver el valor actual del sistema |
| Conexiones activas | Stat | Mostrar número grande y legible |
| Cache hits | Gauge | Mostrar porcentaje visual |
| Duración de requests | Time series | Ver variaciones de performance |

### Queries Adicionales Para Experimentar

```promql
# Métricas básicas disponibles
http_requests_total                    # Total acumulado de requests
http_request_errors_total              # Total acumulado de errores
app_memory_usage_bytes                 # Uso de memoria en bytes
app_cpu_usage_percent                  # Uso de CPU en porcentaje
app_active_connections                 # Conexiones activas ahora
cache_hit_ratio                        # Ratio de hits en cache

# Histogramas (distribuciones)
http_request_duration_seconds          # Duración de requests HTTP
database_query_duration_seconds        # Duración de queries a BD

# Operaciones útiles
http_requests_total / 1000             # Expresar en miles
app_memory_usage_bytes / (1024*1024)   # Convertir bytes a MB
app_memory_usage_bytes / (1024*1024*1024)  # Convertir bytes a GB
```

### Tips para un Mejor Dashboard

1. **Agrupa por contexto:** Coloca métricas relacionadas juntas
2. **Usa títulos descriptivos:** Debe ser claro qué mide cada panel
3. **Define unidades:** Siempre especifica si es segundos, MB, porcentajes, etc.
4. **Configura umbrales:** En Gauges y Stats, define colores para alertar valores críticos
5. **Actualización automática:** En la parte superior derecha, establece el intervalo (ej: "5 segundos")
6. **Range de tiempo:** Usa el selector temporal para analizar distintos períodos

### D. Simular Carga

Para generar tráfico y ver las métricas en acción:

**Opción 1: Con curl (línea de comandos)  En PowerShell (Windows)**

```bash
# En loop infinito
while true; do 
  curl -s http://localhost:3000/api/users > /dev/null
  sleep 0.5
done

# O más rápido
for i in {1..100}; do 
  curl -s http://localhost:3000/api/users > /dev/null &
done
```

### E. Ver Alertas

1. Accede a http://localhost:9090
2. Click en **Alerts**
3. Verás las alertas definidas en `alert_rules.yml`
4. Simula carga para disparar alertas

Puedes ver en Alertmanager (http://localhost:9093) cuando se disparan.

## 📈 Métricas Disponibles en la Aplicación

### ✅ Métricas Simples (Funcionan bien en Grafana)

Estas métricas devuelven datos directo sin necesidad de funciones complejas:

| Métrica | Tipo | Descripción |
|---------|------|-------------|
| `http_requests_total` | Counter | Total acumulado de requests HTTP |
| `http_request_errors_total` | Counter | Total acumulado de errores |
| `app_memory_usage_bytes` | Gauge | Uso de memoria en bytes (actual) |
| `app_cpu_usage_percent` | Gauge | Uso de CPU en porcentaje (actual) |
| `app_active_connections` | Gauge | Conexiones activas ahora |
| `cache_hit_ratio` | Gauge | Ratio de cache hits (0-1) |

### 📊 Métricas de Histograma (Requieren historial)

Estas necesitan que pases suficiente tiempo recolectando datos:

| Métrica | Tipo | Descripción |
|---------|------|-------------|
| `http_request_duration_seconds` | Histogram | Duración de requests HTTP |
| `database_query_duration_seconds` | Histogram | Duración de queries a BD |

**Nota:** Para usar funciones como `rate()` o `histogram_quantile()` en estas métricas, necesitas:
- Al menos 1-2 minutos de datos históricos
- Cambiar el rango de tiempo en Grafana a "Last 1 hour" o más

## 🔧 Configuración Personalizada

### Cambiar contraseña de Grafana

En `docker-compose.yml`, busca la sección de Grafana:

```yaml
environment:
  - GF_SECURITY_ADMIN_PASSWORD=tu-nueva-contraseña
```

### Agregar más targets a Prometheus

En `prometheus.yml`, agregua bajo `scrape_configs`:

```yaml
  - job_name: 'mi-nuevo-servicio'
    static_configs:
      - targets: ['localhost:8080']
```

### Cambiar intervalo de scrape

En `prometheus.yml`:

```yaml
global:
  scrape_interval: 30s  # Cambiar aquí
```

## 🐛 Troubleshooting

### Los paneles muestran "No data"

**Problema:** Las queries de función como `rate()` o `histogram_quantile()` dicen "No data"

**Solución:** Estas funciones requieren:
1. **Suficiente historial de datos** - Cambia el rango de tiempo a "Last 1 hour" o "Last 6 hours"
2. **Generar tráfico continuamente** - Ejecuta en PowerShell:
   ```powershell
   while ($true) {
     Invoke-WebRequest -Uri http://localhost:3000/api/users -ErrorAction SilentlyContinue > $null
     Start-Sleep -Milliseconds 300
   }
   ```
3. **Usar métricas simples primero** - Las queries básicas funcionan mejor:
   ```promql
   http_requests_total        # ✅ Funciona sin historial
   rate(http_requests_total[1m])  # ⚠️ Necesita datos históricos
   ```

### Las contenedores no inician

```bash
# Ver logs
docker-compose logs

# Revisar errores específicos
docker-compose logs prometheus
docker-compose logs app
```

### Prometheus no recopila métricas

1. Verifica que la app responde:
   ```bash
   curl http://localhost:3000/metrics
   ```

2. Revisa el estado de targets en Prometheus:
   - http://localhost:9090/targets

3. Reinicia los contenedores:
   ```bash
   docker-compose restart
   ```

### Grafana no conecta con Prometheus

1. Ve a **Configuration → Data Sources**
2. Edita Prometheus
3. Verifica la URL: debe ser `http://prometheus:9090`
4. Click en "Save & Test"

## 📝 Endpoints de la Aplicación

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/` | GET | Página principal HTML |
| `/api/users` | GET | Lista de usuarios (con DB delay) |
| `/api/data` | GET | Obtiene datos (con DB delay) |
| `/api/error` | GET | Simula errores (30% probabilidad) |
| `/metrics` | GET | Métricas en formato Prometheus |

## 🧹 Limpiar

Para detener y eliminar todo:

```bash
# Detener contenedores
docker-compose down

# Eliminar volúmenes (datos históricos)
docker-compose down -v

# Eliminar todo incluyendo imágenes
docker-compose down -v --rmi all
```

## 📚 Ejercicios Propuestos

### Ejercicio 1: Ampliar tu Dashboard

Ahora que tienes 3 paneles básicos, intenta agregar más:

1. Agrega un panel para **http_request_errors_total** (errors totales)
2. Agrega un panel para **app_cpu_usage_percent** (uso de CPU)
3. Agrega un panel para **cache_hit_ratio** (ratio de cache)

**Tip:** Usa diferentes tipos de visualización:
- **Time series** para métricas que cambian con el tiempo
- **Gauge** para valores actuales
- **Stat** para números grandes

### Ejercicio 2: Configurar Alertas
1. Edita `alert_rules.yml`
2. Agrega una nueva alerta personalizada
3. Recarga prometheus: `docker-compose restart prometheus`
4. Verifica que aparece en http://localhost:9090/alerts

### Ejercicio 3: Analizar Datos
1. Simula carga con `while` loop
2. Va a Prometheus y crea queries para:
   - P50, P95, P99 de latencia
   - Error rate
   - Conexiones activas

### Ejercicio 4: Notificaciones
1. Configura email o webhook en `alertmanager.yml`
2. Crea alertas que se disparen automáticamente
3. Verifica que recibas las notificaciones

## 🔗 Recursos

- [Documentación oficial de Prometheus](https://prometheus.io/docs/)
- [Documentación oficial de Grafana](https://grafana.com/docs/)
- [Prom Client para Node.js](https://github.com/siimon/prom-client)
- [Ejemplos de PromQL](https://prometheus.io/docs/prometheus/latest/querying/examples/)

## 💡 Tips

1. **Métricas de alta cardinalidad**: Evita labels con valores muy variados (como IDs de usuarios)
2. **Retención de datos**: Por defecto Prometheus guarda 15 días. Configurable en `prometheus.yml`
3. **Alertas cerradas manualmente**: Usa Alertmanager para silenciar alertas temporalmente
4. **Performance**: Si tienes muchas métricas, aumenta los intervalos de scrape

---

¡Disfruta el laboratorio! 🎉
