FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the Vite app
RUN npm run build

# Install serve to serve the built static files
RUN npm install -g serve

# Expose the port serve will run on
EXPOSE 5173

# Start the app
CMD ["serve", "-s", "dist", "-l", "5173"]
