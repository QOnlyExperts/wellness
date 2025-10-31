# Imagen base con Node 20
FROM node:20

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Exponemos el puerto de desarrollo de Vite
EXPOSE 4000

# Comando para levantar la app en modo desarrollo
CMD ["npm", "run", "dev"]
