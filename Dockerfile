# ============================================================
# Oyoyo — Frontend PWA (Vue 3 + Vite) servi par Nginx
# ============================================================

# --- Étape 1 : build Vite ---
FROM node:18-alpine AS build
WORKDIR /app

# Variables d'environnement injectées au build (chemins relatifs => même origine via Nginx)
ARG VITE_API_BASE_URL=/api
ARG VITE_WSS_BASE_URL=http://localhost
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WSS_BASE_URL=$VITE_WSS_BASE_URL

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000

COPY . .
RUN yarn build

# --- Étape 2 : service Nginx ---
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
