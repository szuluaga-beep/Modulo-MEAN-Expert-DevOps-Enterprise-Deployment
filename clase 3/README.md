# Clase 3: Orquestación con Kubernetes

## Introducción
La orquestación de contenedores es el proceso de automatizar el despliegue, la gestión, el escalado y la red de contenedores. Kubernetes (K8s) es la plataforma de orquestación más popular y potente en la actualidad.

## ¿Qué es Kubernetes?
Kubernetes es un sistema de código abierto para automatizar el despliegue, el escalado y la gestión de aplicaciones en contenedores. Agrupa los contenedores que conforman una aplicación en unidades lógicas para una fácil gestión y descubrimiento.

## Arquitectura de Kubernetes

![Arquitectura de Kubernetes](./kubernetes-architecture.svg)

La arquitectura de Kubernetes se divide en dos componentes principales:

### **Control Plane (Plano de Control)**
Es el cerebro del cluster que toma decisiones globales sobre el cluster y detecta y responde a eventos del cluster.

### **Worker Nodes (Nodos de Trabajo)**
Son las máquinas que ejecutan las aplicaciones en contenedores organizadas en Pods.

## Conceptos Clave

### 1. Pod
Es la unidad de ejecución más pequeña y básica de una aplicación en Kubernetes. Un Pod encapsula uno o más contenedores, recursos de almacenamiento (volúmenes), una dirección IP única y opciones que controlan cómo deben ejecutarse el/los contenedor(es).

### 2. Service (Servicio)
Es una abstracción que define un conjunto lógico de Pods y una política para acceder a ellos. Los servicios permiten que las aplicaciones sean accesibles y se comuniquen entre sí.

### 3. Deployment (Despliegue)
Un Deployment proporciona actualizaciones declarativas para los Pods y ReplicaSets. Tú describes el estado deseado en un Deployment, y el controlador del Deployment cambia el estado actual al estado deseado a un ritmo controlado.

### 4. Node (Nodo)
Es una máquina de trabajo (física o virtual) en Kubernetes. Cada nodo es gestionado por el Master. Un nodo puede tener múltiples pods, y el Master de Kubernetes maneja automáticamente la programación de los pods en los nodos del clúster.

### 5. Cluster (Clúster)
Es un conjunto de máquinas de nodos para ejecutar aplicaciones en contenedores. Si estás ejecutando Kubernetes, estás ejecutando un clúster.

## Beneficios de la Orquestación
*   **Alta Disponibilidad:** Sin tiempo de inactividad, lo que significa que la aplicación es accesible para los usuarios en todo momento.
*   **Escalabilidad:** Alto rendimiento y capacidad de respuesta, escalando la aplicación según la carga.
*   **Recuperación ante desastres:** Copia de seguridad y restauración de datos, y restauración del estado del servidor.

## Comandos Básicos
*   `kubectl get pods` - Listar todos los pods.
*   `kubectl get services` - Listar todos los servicios.
*   `kubectl run <nombre>` - Iniciar un pod.
*   `kubectl apply -f <archivo.yaml>` - Aplicar una configuración desde un archivo.

## Ejercicio Práctico: Desplegar una Aplicación MEAN en Kubernetes

### Objetivo
Crear y desplegar una aplicación MEAN stack completa en un clúster de Kubernetes local usando Minikube, configurando todos los componentes necesarios (MongoDB, Express/Node.js API, y Angular frontend).

---

## Paso a Paso para Desarrollar el Ejercicio

### Paso 1: Configurar el Entorno Local

#### 1.1 Instalar Minikube
```bash
# En Windows (usando Chocolatey)
choco install minikube

# O descargar el instalador desde:
# https://minikube.sigs.k8s.io/docs/start/
```

#### 1.2 Instalar kubectl
```bash
# En Windows (usando Chocolatey)
choco install kubernetes-cli

# Verificar instalación
kubectl version --client
```

#### 1.3 Iniciar Minikube
```bash
# Iniciar el clúster
minikube start --driver=docker

# Verificar el estado
minikube status

# Habilitar el dashboard (opcional)
minikube dashboard
```

---

### Paso 2: Crear la Estructura del Proyecto

```bash
# Crear carpeta para los manifiestos
mkdir k8s-manifests
cd k8s-manifests

# Crear subcarpetas para cada componente
mkdir mongodb backend frontend
```

---

### Paso 3: Configurar MongoDB

#### 3.1 Crear PersistentVolumeClaim (mongodb/pvc.yaml)
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongodb-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

#### 3.2 Crear Deployment de MongoDB (mongodb/deployment.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
  labels:
    app: mongodb
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:6.0
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          value: "admin"
        - name: MONGO_INITDB_ROOT_PASSWORD
          value: "password123"
        volumeMounts:
        - name: mongodb-storage
          mountPath: /data/db
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
      volumes:
      - name: mongodb-storage
        persistentVolumeClaim:
          claimName: mongodb-pvc
```

#### 3.3 Crear Service de MongoDB (mongodb/service.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: mongodb-service
spec:
  selector:
    app: mongodb
  ports:
  - protocol: TCP
    port: 27017
    targetPort: 27017
  type: ClusterIP
```

#### 3.4 Aplicar configuración de MongoDB
```bash
kubectl apply -f mongodb/pvc.yaml
kubectl apply -f mongodb/deployment.yaml
kubectl apply -f mongodb/service.yaml

# Verificar
kubectl get pods
kubectl get svc
```

---

### Paso 4: Configurar el Backend (Node.js/Express)

#### 4.1 Crear ConfigMap (backend/configmap.yaml)
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: backend-config
data:
  MONGODB_URI: "mongodb://admin:password123@mongodb-service:27017/meanapp?authSource=admin"
  PORT: "3000"
```

#### 4.2 Crear Deployment del Backend (backend/deployment.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  labels:
    app: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: node:18-alpine
        command: ["/bin/sh"]
        args: ["-c", "npm install && npm start"]
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: backend-config
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
```

#### 4.3 Crear Service del Backend (backend/service.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
  type: ClusterIP
```

#### 4.4 Aplicar configuración del Backend
```bash
kubectl apply -f backend/configmap.yaml
kubectl apply -f backend/deployment.yaml
kubectl apply -f backend/service.yaml

# Verificar
kubectl get pods -l app=backend
kubectl get svc backend-service
```

---

### Paso 5: Configurar el Frontend (Angular)

#### 5.1 Crear Deployment del Frontend (frontend/deployment.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: nginx:alpine
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
```

#### 5.2 Crear Service del Frontend (frontend/service.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: NodePort
```

#### 5.3 Aplicar configuración del Frontend
```bash
kubectl apply -f frontend/deployment.yaml
kubectl apply -f frontend/service.yaml

# Verificar
kubectl get pods -l app=frontend
kubectl get svc frontend-service
```

---

### Paso 6: Verificar el Despliegue Completo

```bash
# Ver todos los pods
kubectl get pods

# Ver todos los servicios
kubectl get svc

# Ver todos los deployments
kubectl get deployments

# Ver información detallada de un pod
kubectl describe pod <nombre-del-pod>

# Ver logs de un pod
kubectl logs <nombre-del-pod>
```

---

### Paso 7: Escalar la Aplicación

```bash
# Escalar el backend a 5 réplicas
kubectl scale deployment backend --replicas=5

# Verificar el escalado
kubectl get pods -l app=backend

# Ver el estado del deployment
kubectl rollout status deployment/backend
```

---

### Paso 8: Realizar un Rolling Update

#### 8.1 Actualizar la imagen del backend
```bash
# Actualizar la imagen (simulando una nueva versión)
kubectl set image deployment/backend backend=node:20-alpine

# Observar el rolling update
kubectl rollout status deployment/backend

# Ver el historial de revisiones
kubectl rollout history deployment/backend
```

#### 8.2 Rollback si es necesario
```bash
# Revertir a la versión anterior
kubectl rollout undo deployment/backend

# Revertir a una revisión específica
kubectl rollout undo deployment/backend --to-revision=1
```

---

### Paso 9: Acceder a la Aplicación

```bash
# Obtener la URL del frontend
minikube service frontend-service --url

# O abrir directamente en el navegador
minikube service frontend-service
```

---

### Paso 10: Monitoreo y Debugging

```bash
# Ver el uso de recursos
kubectl top nodes
kubectl top pods

# Ejecutar comandos dentro de un pod
kubectl exec -it <nombre-del-pod> -- /bin/sh

# Ver eventos del clúster
kubectl get events --sort-by=.metadata.creationTimestamp

# Describir un recurso para debugging
kubectl describe deployment backend
kubectl describe pod <nombre-del-pod>
```

---

### Paso 11: Limpieza

```bash
# Eliminar todos los recursos creados
kubectl delete -f frontend/
kubectl delete -f backend/
kubectl delete -f mongodb/

# O eliminar por etiquetas
kubectl delete all -l app=frontend
kubectl delete all -l app=backend
kubectl delete all -l app=mongodb

# Detener Minikube
minikube stop

# Eliminar el clúster (opcional)
minikube delete
```

---

## Entregables del Ejercicio

1. **Archivos YAML**: Todos los manifiestos de configuración organizados por carpetas
2. **Documentación**: Un archivo `COMMANDS.md` con todos los comandos ejecutados
3. **Capturas de pantalla** mostrando:
   - `kubectl get pods` con todos los pods corriendo
   - `kubectl get svc` con todos los servicios
   - `kubectl get deployments` con los deployments
   - El dashboard de Minikube
   - La aplicación funcionando en el navegador

4. **Reporte**: Un documento explicando:
   - Desafíos encontrados y cómo se resolvieron
   - Observaciones sobre el comportamiento de Kubernetes
   - Diferencias entre desplegar con Docker Compose vs Kubernetes

---

## Conceptos Aprendidos

Al completar este ejercicio, habrás practicado:
- ✅ Configuración de un clúster de Kubernetes local
- ✅ Creación de Deployments, Services y PersistentVolumeClaims
- ✅ Gestión de configuración con ConfigMaps
- ✅ Implementación de health checks (liveness y readiness probes)
- ✅ Configuración de recursos (requests y limits)
- ✅ Escalado horizontal de aplicaciones
- ✅ Rolling updates y rollbacks
- ✅ Debugging y monitoreo de aplicaciones en Kubernetes

---

## Recursos Adicionales

- [Documentación oficial de Kubernetes](https://kubernetes.io/docs/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kubernetes Patterns](https://www.redhat.com/en/resources/cloud-native-container-design-whitepaper)
