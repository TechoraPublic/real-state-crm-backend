FROM node:22-alpine

# Application directory
WORKDIR /app

# Copy package files first
# This allows Docker to cache npm install layer
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Application port
EXPOSE 5000

# Start development server
CMD ["npm", "run", "dev"]