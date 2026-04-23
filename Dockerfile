FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci

RUN npx prisma generate

COPY tsconfig*.json ./
COPY src ./src/

RUN npm run build && ls -la dist/


FROM node:22-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Instalar solo dependencias de producción + prisma CLI para migraciones
RUN npm ci --omit=dev && npm install prisma

COPY --from=builder /app/dist ./dist

# Generar Prisma client para la etapa de producción
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
