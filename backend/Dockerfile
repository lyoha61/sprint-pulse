# Stage 1: Build/Dependencies
FROM node:22-alpine AS builder

WORKDIR /app


COPY package.json package-lock.json ./
COPY backend ./backend
COPY frontend ./frontend

RUN npm ci

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY --from=builder /app/backend ./backend

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=backend"]
