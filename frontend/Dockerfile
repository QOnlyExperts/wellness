# Imagen base con Node 20
FROM node:20

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Exponemos el puerto de desarrollo de Vite
EXPOSE 5173

# Comando para levantar la app en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

