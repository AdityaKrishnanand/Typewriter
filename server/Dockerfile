FROM node:18-alpine

# Install build dependencies
RUN apk add --no-cache build-base python3

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate

RUN npx prisma migrate deploy

# Expose port and run the application
EXPOSE 3001
CMD ["npm", "start"]
