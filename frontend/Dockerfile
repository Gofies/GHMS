FROM node:18.16.0-alpine

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the frontend code
COPY frontend/. .

# Build the application for production
RUN npm run build

# Expose port 3000 for development server
EXPOSE 3000

CMD ["npm", "run", "start"]

# Set the default environment to development if NODE_ENV is not set
#ENV NODE_ENV=${NODE_ENV:-development}

# Conditional CMD based on the environment
#CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm run start; else npm run dev; fi"]