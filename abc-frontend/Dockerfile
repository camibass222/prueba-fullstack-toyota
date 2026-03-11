# ================================
# ETAPA 1: Construcción
# ================================
FROM node:18-alpine AS build

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build --configuration=production

# ================================
# ETAPA 2: Servidor de producción
# ================================
FROM nginx:alpine

# Eliminar configuración por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos construidos desde la etapa anterior
# Nota: Ajustar la ruta según tu configuración de Angular
COPY --from=build /app/dist/abc-frontend/browser /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]