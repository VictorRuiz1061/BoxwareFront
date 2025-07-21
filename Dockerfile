
# Etapa única para desarrollo
FROM node:22.1.0-alpine3.19 AS dev

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo los archivos de dependencias para aprovechar el cache de capas
COPY package*.json ./

# Instalar dependencias sin generar archivos temporales innecesarios
RUN npm install 

# Copiar el resto del código fuente
COPY . .

# Argumentos de construcción (útiles para entornos controlados)
ARG VITE_API_URL=http://localhost:3000
ARG VITE_TOKEN_EXPIRY=600
ARG VITE_NODE_ENV=development

# Variables de entorno (no almacenar secretos aquí en producción)
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_TOKEN_EXPIRY=${VITE_TOKEN_EXPIRY}
ENV VITE_NODE_ENV=${VITE_NODE_ENV}
ENV API="http://Boxware.com"

# Puerto por defecto de Vite
EXPOSE 5173

# Solución para plataformas con problemas de permisos
CMD ["sh", "-c", "npm run dev"]
