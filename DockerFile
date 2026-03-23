FROM node:20-alpine

WORKDIR /app

# Instalar mysql-client ANTES de cualquier otra cosa
RUN apk add --no-cache mysql-client

COPY package*.json ./

RUN npm install

COPY . .

RUN echo "=== CONTENIDO DE /app ===" && ls -R /app

EXPOSE 3000

CMD ["npm", "start"]