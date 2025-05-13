FROM node:18-alpine

WORKDIR /app

# Install dependencies (include devDependencies)
COPY package*.json ./
ENV NODE_ENV=development
RUN npm install

# Copy project files
COPY . .

# Build the Vite app
RUN ./node_modules/.bin/vite build

# Install 'serve' globally to serve static files
RUN npm install -g serve

# Expose the port used by serve
EXPOSE 5173

# Start the static server
CMD ["serve", "-s", "dist", "-l", "5173"]
