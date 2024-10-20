FROM node:18.16.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Set the default environment to development if NODE_ENV is not set
ENV NODE_ENV=${NODE_ENV:-development}

# Conditional CMD based on the environment
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm run start; else npm run dev; fi"]