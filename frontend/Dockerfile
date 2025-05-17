# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Usar secretos de compilación para inyectar variables durante npm run build
RUN --mount=type=secret,id=supabase_url \
    --mount=type=secret,id=supabase_key \
    VITE_SUPABASE_URL=$(cat /run/secrets/supabase_url) \
    VITE_SUPABASE_ANON_KEY=$(cat /run/secrets/supabase_key) \
    npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]