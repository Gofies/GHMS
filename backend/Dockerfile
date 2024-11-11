FROM node:18.16.0-alpine

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/ .

CMD ["npm", "run", "start"]