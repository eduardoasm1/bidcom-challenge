# Bidcom Challenge API

API REST para gestión de productos con NestJS, Fastify, PostgreSQL y Prisma.

## Quick Start (Docker)

```bash
docker-compose up
```

Eso levanta PostgreSQL + app con migrations automáticas. API en `http://localhost:3000` • Swagger en `/api`

## Setup local

### 1. Instalación

```bash
npm install
cp .env.example .env
```

### 2. Variables de entorno

#### Desarrollo (`.env`)

```bash
# PostgreSQL - reemplazar con tus valores
DATABASE_URL="postgresql://neondb_owner:npg_rk7c3BClVaJt@ep-long-surf-am4rodrm-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
PORT=3000
```

#### Tests de Integración (`.env.test`)

```bash
# Misma BD que desarrollo pero con limpieza entre tests
DATABASE_URL="postgresql://neondb_owner:npg_rk7c3BClVaJt@ep-long-surf-am4rodrm-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

**Nota técnica:** Actualmente, tests y desarrollo comparten BD. Los tests limpian con `deleteMany()` antes de cada test. 

**Informacion:** Para una mejora en los tests se puede crear un schema separado (`schema=test`) o BD dedicada para tests para evitar riesgo de pérdida de datos de desarrollo. Esto se puede agregar fácilmente sin cambios mayores en el código.

### 3. Migraciones y ejecución

```bash
npm run db:migrate:dev
npm run start:dev
```

### Docker

```bash
docker-compose up
```
API disponible en `http://localhost:3000` • Swagger en `/api`

## Tests

```bash
npm run test              # Unit tests (16 tests)
npm run test:integration  # Integration tests (18 tests)
npm run test:cov          # Coverage report
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
- Índices de base de datos para búsquedas optimizadas

## Plus: Optimizaciones de Base de Datos

### Índices

Se agregaron índices específicos para los patrones de búsqueda reales del endpoint `GET /products/search`:

| Índice | Campos | Por qué |
|--------|--------|---------|
| `products_category_brand_idx` | `(category, brand)` | Compuesto: cubre búsquedas por `category`, `brand`, o ambos a la vez. PostgreSQL usa el prefijo izquierdo del índice. |
| `products_price_idx` | `(price)` | Filtros de rango `minPrice`/`maxPrice` — B-tree es óptimo para `>=` y `<=`. |

### Tipos de columna

Los campos de texto usan `VarChar`.

- `name VARCHAR(255)`, `category VARCHAR(100)`, `brand VARCHAR(100)`, `description VARCHAR(1000)`

Esto limita el tamaño a nivel de base de datos, mejora la integridad de datos y reduce el almacenamiento promedio por fila.

---

## Plus: Concurrencia — Optimistic Locking

En un ecommerce, dos procesos pueden intentar modificar el mismo producto al mismo tiempo (actualizaciones de stock, cambios de precio desde distintos canales). Sin protección, el último en escribir gana y se pierde el cambio del otro.

**Cómo funciona:**

Cada producto tiene un campo `version` (entero, empieza en 1). El cliente lo recibe en cada respuesta y debe enviarlo en `PUT`/`PATCH`:

```
GET /products/abc  →  { id: "abc", stock: 10, version: 3, ... }

PUT /products/abc  body: { stock: 8, version: 3, ... }  →  200  { version: 4 }
PUT /products/abc  body: { stock: 5, version: 3, ... }  →  409 Conflict
```

El segundo request falla porque la versión 3 ya no existe — fue incrementada por el primero. El cliente debe hacer un nuevo GET y reintentar con la versión actual.

**Implementación:**

El update en el repositorio usa `WHERE { id, version }` atómicamente en PostgreSQL. Si la fila no matchea (porque otro request ya la modificó), Prisma lanza `P2025` → se convierte en `409 Conflict`. No hay locks, no hay transacciones extra — la atomicidad la garantiza el motor de base de datos.

```
client A: GET → version: 3
client B: GET → version: 3
client A: PUT version: 3 → OK  (DB: version = 4)
client B: PUT version: 3 → 409 (WHERE id=x AND version=3 → no rows)
```

---

## Por qué PostgreSQL en tests (no SQLite)

El challenge sugería SQLite in-memory. Usamos PostgreSQL real porque:

- `mode: 'insensitive'` — búsqueda case-insensitive es feature exclusiva de Postgres en Prisma
- `@db.Decimal(10, 2)` — tipo nativo de Postgres; SQLite no tiene equivalente

Tests contra el mismo motor que producción evita sorpresas en deploy.
