# ==========================================
# STAGE 1: Build
# ==========================================
FROM node:20-alpine AS builder

# Incluye devDependencies (necesario para @nestjs/cli)
ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==========================================
# STAGE 2: Production
# ==========================================
FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]

# ==========================================
# STAGE: Development (used by docker-compose)
# ==========================================
FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]


