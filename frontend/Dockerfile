# Use a minimal Node.js image for the frontend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 3000 (default React dev server port)
EXPOSE 3000

# Set the default environment to development if NODE_ENV is not set
ENV NODE_ENV=${NODE_ENV:-development}

# Conditional CMD based on the environment
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm run start; else npm run dev; fi"]
