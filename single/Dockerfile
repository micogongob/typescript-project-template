FROM node:18.16.0-bullseye-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /build
COPY --chown=node:node . /build
RUN npm install
RUN npm run build && ls -la dist

FROM node:18.16.0-bullseye-slim
COPY --from=builder /usr/bin/dumb-init /usr/bin/dumb-init
ENV NODE_ENV production

WORKDIR /app
COPY --chown=node:node --from=builder /build/package.json /build/package.json /app
COPY --chown=node:node --from=builder /build/dist /app/dist
RUN npm install --omit=dev

USER node
CMD ["dumb-init", "node", "dist/index.js"]