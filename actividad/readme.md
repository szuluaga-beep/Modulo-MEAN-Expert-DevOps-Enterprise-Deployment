# 🏗️ Actividad: Despliegue de Portafolio Profesional en la Nube

## Descripción

El objetivo de esta actividad es llevar tu desarrollo del entorno local (`localhost`) a un entorno de producción real, permitiendo que cualquier reclutador o colega pueda acceder a tu trabajo mediante una URL pública.

---

## 🎯 Objetivos de Aprendizaje

- Configurar un proyecto de Angular para producción
- Gestionar variables de entorno y secretos
- Implementar un flujo de Integración Continua (CI/CD) conectando GitHub con un proveedor Cloud
- (Opcional) Desplegar una arquitectura MEAN completa (MongoDB, Express, Angular, Node.js)

---

## 🛠️ Requisitos Previos

- Cuenta en GitHub
- Proyecto de Angular (Portafolio) finalizado en un repositorio
- Cuenta en uno de los siguientes proveedores: Vercel, Netlify o Railway

---

## 📋 Instrucciones Paso a Paso

### 1. Preparación del Proyecto (Angular)

Antes de subir tu código, asegúrate de que tu aplicación esté lista para el "mundo exterior".

#### Verificación de Scripts

En tu `package.json`, asegúrate de tener el script de construcción:

```json
{
  "scripts": {
    "build": "ng build --configuration production"
  }
}
```

#### Manejo de Rutas

Si usas un SPA (Single Page Application), recuerda que al refrescar la página en producción podrías obtener un error 404.

**Tip:** En Vercel, añade un archivo `vercel.json` en la raíz con:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### 2. Selección del Proveedor de Despliegue

Elige la ruta que mejor se adapte a tu proyecto:

| Proveedor | Ideal para... | Dificultad |
|-----------|---------------|-----------|
| **Vercel** | Angular (Frontend) - Muy rápido y optimizado | Baja |
| **Netlify** | Angular (Frontend) - Excelente gestión de formularios y assets | Baja |
| **Railway** | Apps Fullstack (Node.js + Base de Datos) | Media |

---

### 3. El Proceso de Despliegue (Workflow)

Independientemente del proveedor, el flujo recomendado es:

1. **Conectar GitHub:** Vincula tu cuenta del proveedor con tu perfil de GitHub
2. **Importar Repositorio:** Selecciona el repositorio de tu portafolio
3. **Configurar Build Settings:**
   - **Build Command:** `npm run build` o `ng build`
   - **Output Directory:** `dist/[nombre-de-tu-proyecto]/browser` (Verifica esto en tu carpeta local tras correr el build)
4. **Desplegar:** Haz clic en "Deploy"

---

## 🔥 Reto Opcional: Despliegue Fullstack (MEAN)

Si tu portafolio incluye un backend con Node.js y MongoDB:

- **Base de Datos:** Crea un clúster gratuito en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Backend:** Despliega tu API en Railway o Render
- **Variables de Entorno:** No olvides configurar tu `MONGODB_URI` y `JWT_SECRET` en el panel de control del proveedor (Settings > Variables)
- **CORS:** Asegúrate de que tu backend permita peticiones desde la URL de tu nuevo frontend

---

## 📤 Formato de Entrega

Debes entregar un archivo PDF o un README en tu repositorio que contenga:

1. **URL pública del proyecto funcionando**
2. **Captura de pantalla** del panel de control del proveedor elegido (Dashboard)
3. **Breve reflexión** (máx. 100 palabras) sobre el mayor desafío que encontraste durante el despliegue