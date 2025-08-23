
# Etapa 1: Construcción de la aplicación React
# Usa la imagen oficial de Node.js 20 en su versión Alpine, que es más ligera.
FROM node:20-alpine AS build

# Establece el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copia los archivos package.json y package-lock.json (o yarn.lock) al directorio de trabajo.
# Esto permite que Docker cachee la capa de instalación de dependencias si estos archivos no cambian.
COPY package*.json ./

# Instala las dependencias del proyecto.
RUN npm install

# Copia el resto del código de la aplicación al directorio de trabajo.
COPY . .

# Construye la aplicación React para producción.
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
# Usa la imagen oficial de Nginx en su versión Alpine, que es muy ligera.
FROM nginx:alpine

# Copia los archivos estáticos construidos desde la etapa 'build' al directorio de Nginx.
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80, que es el puerto por defecto de Nginx para HTTP.
EXPOSE 80

# Comando para iniciar Nginx en primer plano.
CMD ["nginx", "-g", "daemon off;"]
