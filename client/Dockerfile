# 1) Build stage: uses full Node with devDependencies
FROM node:18-alpine AS build
WORKDIR /app

# Copy only package files, install EVERYTHING (including vite)
COPY package.json package-lock.json ./
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
RUN npm install

# Copy rest of source & build
COPY . .
RUN npm run build   # calls "vite build"

# 2) Production stage: serve with nginx (no Node, no vite)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose default HTTP port
EXPOSE 80

# Keep nginx running
CMD ["nginx", "-g", "daemon off;"]
