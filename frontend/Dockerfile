FROM node:18.16.0-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

CMD ["npm", "run", "dev"]