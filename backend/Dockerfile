FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json ./
RUN npm install --production

FROM node:18-alpine AS runtime
WORKDIR /app

COPY package.json ./
COPY server.js ./
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3001

CMD ["node", "server.js"]
