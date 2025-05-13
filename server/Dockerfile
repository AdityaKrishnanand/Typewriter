FROM node:18-alpine

# Install build dependencies
RUN apk add --no-cache build-base python3

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

# Expose port and run the application
EXPOSE 3001
CMD ["npm", "start"]
