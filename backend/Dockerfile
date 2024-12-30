FROM node:18.16.0-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY backend/package*.json ./

RUN npm install

COPY backend/ .

CMD ["sh", "-c", "npm run start && node test/testDatabase_init.js"]