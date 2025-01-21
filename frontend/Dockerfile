# BUILD STAGE

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV VITE_SERVER_URL=http://localhost:5175/api

RUN npm run build


# RUN STAGE

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf


