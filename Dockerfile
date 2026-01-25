# --- Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /app

# Accept environment variables during build
ARG VITE_API_URL
ARG VITE_WS_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

# Install and build
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Serve Stage ---
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Clean and copy built frontend
RUN rm -rf ./*
COPY --from=builder /app/dist ./

# Configure Nginx to serve static files
RUN rm /etc/nginx/conf.d/default.conf
RUN cat <<'EOF' > /etc/nginx/conf.d/default.conf
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  # Serve React app (SPA routing)
  location / {
    try_files $uri /index.html;
  }
}
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
