FROM node:18.16.0-alpine

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

CMD ["npm", "run", "dev"]