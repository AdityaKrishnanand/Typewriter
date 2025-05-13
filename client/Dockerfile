FROM node:18-alpine

WORKDIR /app

# Ensure all dependencies including devDependencies are installed
COPY package*.json ./
ENV NODE_ENV=development
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Vite app
RUN npx vite build

# Install serve to serve the built static files
RUN npm install -g serve

# Expose the port serve will run on
EXPOSE 5173

# Start the app
CMD ["serve", "-s", "dist", "-l", "5173"]
