# Build stage
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
COPY .npmrc .
RUN npm install

# Copy all files
COPY . .

ARG BACKEND_API_ENDPOINT="http://localhost:8000"
ARG BACKEND_WS_ENDPOINT="ws://localhost:8000"

ENV REACT_APP_BACKEND_API_ENDPOINT=${BACKEND_API_ENDPOINT}

ENV REACT_APP_BACKEND_WS_ENDPOINT=${BACKEND_WS_ENDPOINT}

# Build the app
RUN npm run build

# Production stage
FROM docker.io/nginx:alpine

# Copy build files from build stage to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Create custom nginx config to use port 3000
RUN echo 'server { \
    listen 3000; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# When the container starts, nginx will serve the app
CMD ["nginx", "-g", "daemon off;"]