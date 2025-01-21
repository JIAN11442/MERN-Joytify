# BUILD STAGE

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# RUN STAGE

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist /app/dist

COPY --from=builder /app/package*.json /app

RUN npm ci --omit=dev

CMD ["npm", "run", "start"]