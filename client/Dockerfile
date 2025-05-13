# 1) Build stage: install devDeps (including vite) & build
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files and install ALL deps
COPY package*.json ./
ENV NODE_ENV=development
RUN npm install

# Make sure local binaries are on the PATH
ENV PATH /app/node_modules/.bin:$PATH

# Copy source & run the Vite build
COPY . .
RUN npm run build

# 2) Prod stage: serve static with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
