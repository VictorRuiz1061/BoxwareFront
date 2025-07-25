# BoxwareFront

Frontend para la aplicación Boxware, un sistema de gestión de inventario.

## Requisitos

- Docker y Docker Compose
- Node.js 18+ (solo para desarrollo local)

## Variables de Entorno

La aplicación utiliza las siguientes variables de entorno:

```
# URL de la API backend
VITE_API_URL=http://localhost:3000

# Tiempo de expiración del token en segundos (1 día = 86400)
VITE_TOKEN_EXPIRY=86400

# Configuración del entorno
VITE_NODE_ENV=development

# Puerto para desarrollo local
VITE_PORT=5173
```

Para configurarlas:

1. En desarrollo local: Crea un archivo `.env` en la raíz del proyecto
2. En Docker: Las variables se configuran en el `docker-compose.yml`

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Construcción y despliegue con Docker

### Opción 1: Usando Docker Compose (recomendado)

```bash
# Construir y ejecutar la aplicación
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener la aplicación
docker-compose down
```

### Opción 2: Usando Docker directamente

```bash
# Construir la imagen con variables de entorno personalizadas
docker build -t boxware-frontend \
  --build-arg VITE_API_URL=http://mi-api-backend:3000 \
  --build-arg VITE_TOKEN_EXPIRY=86400 \
  --build-arg VITE_NODE_ENV=production \
  .

# Ejecutar el contenedor
docker run -d -p 80:80 --name boxware-frontend boxware-frontend

# Detener el contenedor
docker stop boxware-frontend
docker rm boxware-frontend
```

## Publicar en Docker Hub

```bash
# Iniciar sesión en Docker Hub
docker login

# Etiquetar la imagen (reemplaza 'tu-usuario' con tu nombre de usuario de Docker Hub)
docker tag boxware-frontend tu-usuario/boxware-frontend:latest

# Subir la imagen a Docker Hub
docker push tu-usuario/boxware-frontend:latest
```

## Estructura del proyecto

El proyecto está construido con React, TypeScript y Vite, siguiendo una arquitectura modular:

- `/src/api`: Configuración y funciones para llamadas a la API
- `/src/components`: Componentes de React organizados por atomicidad
- `/src/hooks`: Custom hooks para lógica reutilizable
- `/src/context`: Contextos de React para estado global
- `/src/types`: Definiciones de tipos TypeScript
- `/src/utils`: Funciones de utilidad
