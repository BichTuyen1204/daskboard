# Build stage
FROM node:20 as build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
COPY .npmrc .
RUN npm install

# Copy all files
COPY . .

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