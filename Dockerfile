# Alternative self-host path (Fly.io/Railway/etc) — not used by the Vercel
# deployment, which builds and runs serverlessly instead. One image: builds
# the Vite frontend, then runs it from the same Express process as the API.

FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY server ./server

EXPOSE 4000
CMD ["node", "server/src/index.js"]
