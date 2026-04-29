# ==========================================
# STAGE: Development (docker-compose)
# ==========================================
FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["sh", "-c", "npm install --prefer-offline && npm run dev -- --host 0.0.0.0"]

# ==========================================
# STAGE 1: Build
# ==========================================
FROM node:20-alpine AS builder

# NODE_ENV=development asegura que npm ci instale devDependencies (vite, tailwind, etc.)
ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==========================================
# STAGE 2: Serve with nginx
# ==========================================
FROM nginx:alpine AS production

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]





