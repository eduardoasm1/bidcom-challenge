# Bidcom Challenge API

API REST para gestión de productos con NestJS, Fastify, PostgreSQL y Prisma.

## Setup

```bash
npm install
```

Configurar variables de entorno (crear `.env` con `DATABASE_URL`):

```bash
DATABASE_URL="postgresql://neondb_owner:npg_rk7c3BClVaJt@ep-long-surf-am4rodrm-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

```

Inicializar la base de datos:

```bash
npm run db:migrate:dev
```

## Desarrollo

```bash
npm run start:dev
```

API en `http://localhost:3000` • Swagger en `/api`

## Tests

```bash
# Unit tests
npm run test

# Integration tests (requiere .env.test)
npm run test:integration

# Coverage
npm run test:cov
```

## Docker

```bash
docker build -t bidcom .
docker run -p 3000:3000 -e DATABASE_URL="postgresql://neondb_owner:npg_rk7c3BClVaJt@ep-long-surf-am4rodrm-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" bidcom
```

## Estructura

```
src/modules/products/
├── domain/          # Entidades, interfaces, use cases
├── infrastructure/  # Repository, tipos, adaptadores
└── presentation/    # Controllers, DTOs

src/common/
├── filters/         # Exception filter
├── logger/          # Logger service
├── middleware/      # Request logger, tracing
└── context/         # AsyncLocalStorage para traceId
```

## Arquitectura

- Clean Architecture (domain, application, infrastructure)
- Repository pattern
- Factory pattern
- Dependency injection (NestJS)
- Logger + tracing (traceId en cada request)
- Caching en memoria para `GET /products`

## Por qué PostgreSQL en tests (no SQLite)

El challenge sugería SQLite in-memory. Usamos PostgreSQL real porque:

- `mode: 'insensitive'` — búsqueda case-insensitive es feature exclusiva de Postgres en Prisma
- `@db.Decimal(10, 2)` — tipo nativo de Postgres; SQLite no tiene equivalente

Tests contra el mismo motor que producción evita sorpresas en deploy.
