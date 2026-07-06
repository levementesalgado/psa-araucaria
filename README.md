# PSA Araucária

Sistema de Gestão do Programa PSA Araucária — Web (Backoffice) + Android (Campo)

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js + NestJS (TypeScript) |
| Banco | PostgreSQL 15 + PostGIS |
| ORM | Prisma |
| Cache/Fila | Redis + BullMQ |
| Storage | AWS S3 |
| Frontend Web | React 18 + Vite + Tailwind |
| Mobile | Kotlin + Jetpack Compose + Room + Mapbox |

## Estrutura

```
psa-araucaria/
├── backend/           # API NestJS
│   ├── prisma/        # Schema + migrations
│   └── src/
│       ├── common/    # PrismaModule, guards, filters
│       └── modules/   # auth, producers, contracts, trees, payments, sync, media
├── web/               # React + Tailwind
│   └── src/
│       ├── components/
│       ├── pages/     # Dashboard, Produtores, Contratos, Pagamentos, Relatorios
│       └── lib/
├── android/           # Kotlin + Compose
│   └── app/src/main/java/com/psaaraucaria/
│       ├── data/      # Room, Retrofit
│       ├── domain/
│       ├── ui/        # Telas (Mapa, Login, Contratos)
│       └── sync/      # WorkManager
└── docker-compose.yml
```

## Como Rodar

```bash
# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev

# Web
cd web
npm install
npm run dev

# Android
# Abrir android/ no Android Studio e rodar
```

## API

Documentação Swagger em `http://localhost:3000/api/docs` após iniciar o backend.

## Sincronização Offline (Android)

1. Técnico coleta dados sem internet → salvos no Room (SQLite local)
2. WorkManager detecta conectividade e dispara sync em background
3. Dados enviados via `POST /trees/batch` e `POST /media/upload`
4. Backoff exponencial em caso de falha
