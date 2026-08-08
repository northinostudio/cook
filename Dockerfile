# Multi-stage build: compile the Vite frontend, then run it from the same
# Express process that serves the API — one image, one deployable service.

FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY server/package*.json ./server/
RUN npm --prefix server install --omit=dev

COPY --from=build /app/dist ./dist
COPY server ./server

EXPOSE 4000
CMD ["node", "server/src/index.js"]
