# Pruebas Avanzadas de Carga y Optimización de Rendimiento

## Continuación de Clase 6

En la clase anterior aprendimos conceptos básicos de pruebas de carga y estrés. Ahora profundizaremos en estrategias avanzadas de optimización, herramientas especializadas y análisis detallado de resultados.

## Optimizaciones Avanzadas en MongoDB

### Análisis de Queries Lentas

```bash
# En MongoDB Shell
db.setProfilingLevel(1, { slowms: 100 })

# Ver queries lentas
db.system.profile.find({ millis: { $gt: 100 } }).sort({ ts: -1 }).limit(5)
```

### Uso de Explain para optimizar

```javascript
// Analizar ejecución de query
db.products.find({ category: "electronics", price: { $gt: 100 } }).explain("executionStats")

// Resultado muestra:
// - Índices usados
// - Documentos examinados
// - Documentos retornados
// - Tiempo total
```

### Connection Pooling Avanzado

```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 20,
  minPoolSize: 5,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true
});
```

---

## 📚 Temas Principales

### 1. Herramientas Avanzadas de Testing

#### Locust para simulación realista

```python
# locustfile.py
from locust import HttpUser, task, between

class MeanUser(HttpUser):
    wait_time = between(1, 3)
    
    @task(3)
    def get_products(self):
        self.client.get("/api/products")
    
    @task(2)
    def get_single_product(self):
        self.client.get("/api/products/1")
    
    @task(1)
    def create_product(self):
        self.client.post("/api/products", json={
            "name": "Test",
            "price": 99.99
        })

# Ejecución
# locust -f locustfile.py --host=http://localhost:3000
```

---

#### K6 para pruebas modernas

```javascript
// loadtest.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 100 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  let res = http.get('http://localhost:3000/api/products');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}

// Ejecución: k6 run loadtest.js
```

---

### 2. Optimizaciones en Node.js/Express

#### Clustering para multicore

```javascript
const cluster = require('cluster');
const os = require('os');
const express = require('express');

const app = express();

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} murió`);
    cluster.fork();
  });
} else {
  app.listen(3000, () => {
    console.log(`Worker ${process.pid} iniciado`);
  });
}
```

#### Compresión y Caching

```javascript
const compression = require('compression');

app.use(compression());

// Cache estático con ETag
app.use(express.static('public', {
  maxAge: '1d',
  etag: false
}));

// Cache en endpoints
app.get('/api/data', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.json(data);
});
```

#### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100  // 100 requests por ventana
});

app.use('/api/', limiter);
```

---

### 3. Índices en MongoDB

```javascript
// Crear índices para queries frecuentes
db.products.createIndex({ category: 1 });
db.users.createIndex({ email: 1 }, { unique: true });
db.orders.createIndex({ userId: 1, createdAt: -1 });

// Verificar índices
db.products.getIndexes();

// Eliminar índice
db.products.dropIndex("category_1");
```

#### Seleccionar índice correctamente

```javascript
// MALO: Sin índice
db.orders.find({ userId: 123, status: "completed" })

// MEJOR: Con índice compuesto
db.orders.createIndex({ userId: 1, status: 1 });
```

---

### 4. Aggregation Pipeline

```javascript
// Procesar datos sin traerlos todos a memoria
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { 
      _id: "$userId", 
      total: { $sum: "$amount" },
      count: { $sum: 1 }
    }
  },
  { $sort: { total: -1 } },
  { $limit: 10 }
]);
```

---

## Métricas Avanzadas

| Métrica | Bueno | Aceptable | Malo |
|---------|-------|-----------|------|
| **Response Time (p95)** | < 100ms | 100-200ms | > 200ms |
| **Throughput** | > 500 req/s | 100-500 req/s | < 100 req/s |
| **Error Rate** | 0% | < 0.1% | > 0.1% |
| **CPU Usage** | < 50% | 50-70% | > 70% |
| **Memory Usage** | < 60% | 60-80% | > 80% |

---

## Interpretación de Resultados

### Cuello de Botella en BD
```
- Response time alto pero CPU/Memoria normal
- Solución: Agregar índices, optimizar queries
```

### Cuello de Botella en Servidor
```
- CPU/Memoria al 100%
- Solución: Clustering, más instancias, optimizar código
```

### Cuello de Botella en Red
```
- Packet loss, latencia inconsistente
- Solución: Compresión, CDN, optimizar payload
```

---

## Actividades Prácticas

### Actividad 1: Análisis de Query Lenta
1. Activar profiling en MongoDB
2. Identificar query más lenta
3. Crear índice apropiado
4. Medir mejora en tiempo de respuesta

### Actividad 2: Prueba de Carga con Locust
1. Instalar: `pip install locust`
2. Crear locustfile.py con 3 escenarios
3. Ejecutar con 100 usuarios
4. Documentar: Response time, throughput, errores

### Actividad 3: Implementar Clustering
1. Ajusta app.js para usar clustering
2. Mide diferencia en performance CPU-bound
3. Compara con versión sin clustering

---

## Herramientas de Monitoreo

- **PM2 Plus**: Monitoreo de procesos Node.js
- **New Relic**: APM completo
- **DataDog**: Infraestructura y aplicaciones
- **Prometheus + Grafana**: Métricas open-source

```bash
# PM2 - Monitoreo simple
npm install -g pm2
pm2 start app.js -i max  # Clustering automático
pm2 logs
pm2 monit
```

---

## Mejores Prácticas

✓ Medir ANTES de optimizar  
✓ Optimizar BD primero, luego código  
✓ Usar indices con sabiduría (costos de write)  
✓ Cachear respuestas frecuentes  
✓ Escalar horizontalmente si es posible  
✓ Monitorear continuamente en producción  
✓ Documentar baseline de performance
