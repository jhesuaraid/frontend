# Etapa de construcción
FROM node:20-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package.json package-lock.json ./

# Instalar todas las dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine

# Etapa de producción
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
# Copiar el archivo de configuración de Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]