const express = require('express');
const promClient = require('prom-client');

const app = express();

// ============================================
// Configuración de Prometheus Client
// ============================================

// Crear registro por defecto
const register = promClient.register;

// Métricas de Gauge (valor que puede subir y bajar)
const cpuUsage = new promClient.Gauge({
  name: 'app_cpu_usage_percent',
  help: 'Uso de CPU en porcentaje',
  registers: [register]
});

const memoryUsage = new promClient.Gauge({
  name: 'app_memory_usage_bytes',
  help: 'Uso de memoria en bytes',
  registers: [register]
});

const activeConnections = new promClient.Gauge({
  name: 'app_active_connections',
  help: 'Número de conexiones activas',
  registers: [register]
});

// Métricas de Counter (solo aumenta)
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total de requests HTTP',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestErrors = new promClient.Counter({
  name: 'http_request_errors_total',
  help: 'Total de errores en requests HTTP',
  labelNames: ['method', 'route', 'error_type'],
  registers: [register]
});

// Métrica de Histogram (distribución de valores)
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de requests HTTP en segundos',
  labelNames: ['method', 'route'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register]
});

const dbQueryDuration = new promClient.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duración de queries a BD en segundos',
  labelNames: ['operation', 'table'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5],
  registers: [register]
});

// Métrica de Resumen
const cacheHitRatio = new promClient.Gauge({
  name: 'cache_hit_ratio',
  help: 'Ratio de hits en cache',
  registers: [register]
});

// ============================================
// Middleware de monitorización
// ============================================

app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Interceptar el método end() de response
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = (Date.now() - startTime) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    // Registrar métrica de duración
    httpRequestDuration
      .labels(req.method, route)
      .observe(duration);
    
    // Registrar métrica de total
    httpRequestsTotal
      .labels(req.method, route, res.statusCode)
      .inc();
    
    // Llamar al método original
    originalEnd.apply(res, args);
  };
  
  next();
});

// ============================================
// Rutas de la aplicación
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Página principal
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Monitoring Lab</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        .links { margin: 20px 0; }
        a { display: block; margin: 10px 0; color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .info { background: #f0f0f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <h1>⚙️ Laboratorio de Monitorización</h1>
      
      <div class="info">
        <strong>Aplicación de ejemplo con Prometheus y Grafana</strong>
      </div>
      
      <h2>Navegación:</h2>
      <div class="links">
        <a href="/health">Health Check</a>
        <a href="/api/users">API: Listar Usuarios</a>
        <a href="/api/data">API: Obtener Datos</a>
        <a href="/api/error">API: Simular Error</a>
        <a href="/metrics">Métricas Prometheus</a>
      </div>
      
      <h2>Herramientas de Monitorización:</h2>
      <div class="links">
        <a href="http://localhost:9090" target="_blank">🟡 Prometheus (9090)</a>
        <a href="http://localhost:3001" target="_blank">📊 Grafana (3001)</a>
        <a href="http://localhost:9093" target="_blank">🔔 Alertmanager (9093)</a>
        <a href="http://localhost:9100" target="_blank">📈 Node Exporter (9100)</a>
      </div>
      
      <h2>Instrucciones:</h2>
      <ol>
        <li>Accede a Grafana: http://localhost:3001 (admin/admin)</li>
        <li>Agrega Prometheus como datasource</li>
        <li>Crea dashboards con PromQL</li>
        <li>Simula carga con: while true; do curl http://localhost:3000/api/users; done</li>
      </ol>
    </body>
    </html>
  `);
});

// API: Listar usuarios
app.get('/api/users', async (req, res) => {
  try {
    // Simular query a BD
    await simulateDatabaseQuery('SELECT', 'users');
    
    const users = [
      { id: 1, name: 'Juan', email: 'juan@example.com' },
      { id: 2, name: 'María', email: 'maria@example.com' },
      { id: 3, name: 'Carlos', email: 'carlos@example.com' }
    ];
    
    res.json({ success: true, data: users, count: users.length });
  } catch (error) {
    httpRequestErrors
      .labels('GET', '/api/users', 'database_error')
      .inc();
    res.status(500).json({ error: 'Database error' });
  }
});

// API: Obtener datos
app.get('/api/data', async (req, res) => {
  try {
    await simulateDatabaseQuery('SELECT', 'data');
    
    const data = {
      timestamp: new Date(),
      value: Math.random() * 100,
      status: 'active'
    };
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// API: Simular error
app.get('/api/error', (req, res) => {
  const probability = Math.random();
  
  if (probability < 0.3) {
    httpRequestErrors
      .labels('GET', '/api/error', 'simulated')
      .inc();
    res.status(500).json({ error: 'Simulated error' });
  } else {
    res.json({ message: 'No error this time' });
  }
});

// Endpoint de métricas de Prometheus
app.get('/metrics', async (req, res) => {
  try {
    // Actualizar métricas de sistema
    const memUsage = process.memoryUsage();
    memoryUsage.set(memUsage.heapUsed);
    
    // Simular CPU (en un app real usarías os.cpus())
    cpuUsage.set(Math.random() * 100);
    
    // Simular conexiones activas
    activeConnections.set(Math.floor(Math.random() * 50));
    
    // Simular ratio de cache
    cacheHitRatio.set(0.75 + Math.random() * 0.2);
    
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error.message);
  }
});

// ============================================
// Funciones auxiliares
// ============================================

// Simular query a la base de datos
async function simulateDatabaseQuery(operation, table) {
  const start = Date.now();
  
  // Simular delay de BD (entre 10ms y 500ms)
  const delay = Math.random() * 490 + 10;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const duration = (Date.now() - start) / 1000;
  dbQueryDuration
    .labels(operation, table)
    .observe(duration);
}

// ============================================
// Manejo de errores no capturados
// ============================================

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  httpRequestErrors.labels('UNKNOWN', 'unknown', 'uncaught_exception').inc();
});

// ============================================
// Iniciar servidor
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════╗
║      Monitoring Lab - Servidor Activo     ║
╠════════════════════════════════════════════╣
║ Puerto: ${PORT}                               
║ Métricas: http://localhost:${PORT}/metrics
║ Health: http://localhost:${PORT}/health
║ Dashboard: http://localhost:3001
╚════════════════════════════════════════════╝
  `);
});

module.exports = app;
