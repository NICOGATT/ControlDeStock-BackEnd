FROM node:20

WORKDIR /app

# Instalar MySQL client (no MariaDB) para compatibilidad con MySQL 8
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

RUN echo "=== CONTENIDO DE /app ===" && ls -R /app

EXPOSE 3000

CMD ["npm", "start"]