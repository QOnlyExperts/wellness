FROM node:20
WORKDIR /app
COPY package*.json ./
# RUN npm install
RUN npm install
COPY . .
# Compilar TypeScript
EXPOSE 4000
# Ejecutar el código compilado
# CMD ["node", "dist/index.js"]
# Comando por defecto
CMD ["npm", "run", "dev"]