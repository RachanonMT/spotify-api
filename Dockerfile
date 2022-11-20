# Stage1 as builder
FROM node:latest as builder

# Copy the package.json to install dependencies
COPY package.json package-lock.json ./

# Install the dependencies and make the folder
RUN npm install && mkdir /spotify && mv ./node_modules ./spotify

# Work directory
WORKDIR /spotify

COPY . .

# Build the project and copy the files
RUN npm run build


# Build nginx
FROM nginx:latest

#!/bin/sh
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder /spotify/build /usr/share/nginx/html

# Expose port 80
EXPOSE 3000 80
