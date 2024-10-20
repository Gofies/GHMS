# Frontend Dockerfile

FROM node:18.16.0-alpine AS build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/. . 

# Build your app
RUN npm run build

# Use NGINX to serve the app
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf 
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]