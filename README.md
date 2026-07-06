# PSA Araucária

Sistema de Gestão do Programa PSA Araucária — Web (Backoffice/Usuário) + Android (Campo)

## Stack

| Camada         | Tecnologia                                                    |
| -------------- | ------------------------------------------------------------- |
| Backend        | Node.js + NestJS (TypeScript) + Prisma + PostgreSQL 15 + PostGIS |
| Cache / Fila   | Redis + BullMQ                                                |
| Storage        | AWS S3 (fotos georreferenciadas)                              |
| Frontend Web   | React 18 + Vite + Tailwind CSS                                |
| Mobile Android | Kotlin + Jetpack Compose + Room + Retrofit + WorkManager + Mapbox |

---

## Estrutura do Projeto

```
psa-araucaria/
├── backend/                          # API REST (NestJS)
│   ├── prisma/
│   │   ├── schema.prisma             # Modelo de dados (10 tabelas)
│   │   └── migrations/               # Migrations SQL + PostGIS
│   └── src/
│       ├── main.ts                   # Entrada do servidor (porta 3000)
│       ├── app.module.ts             # Módulo raiz
│       ├── common/
│       │   ├── prisma.module.ts
│       │   └── prisma.service.ts     # Conexão com banco
│       └── modules/
│           ├── auth/                 # Login, registro, JWT
│           ├── producers/            # CRUD produtores
│           ├── properties/           # Imóveis rurais
│           ├── contracts/            # Contratos por modalidade (4 tipos)
│           ├── trees/                # Araucárias (georreferenciamento)
│           ├── payments/             # Parcelas e pagamentos
│           ├── trainings/            # Capacitações obrigatórias
│           ├── activities/           # Atividades complementares
│           ├── sync/                 # Sincronização offline (BullMQ)
│           └── media/                # Upload de fotos (S3)
│
├── web/                              # Frontend React
│   └── src/
│       ├── pages/
│       │   ├── LoginPage.tsx         # Login
│       │   ├── RegisterPage.tsx      # Cadastro
│       │   ├── DashboardPage.tsx     # Dashboard do usuário
│       │   ├── ContractsPage.tsx     # Contratos + parcelas
│       │   ├── TreesPage.tsx         # Listagem de árvores
│       │   ├── NewTreePage.tsx       # Registro de árvore (GPS)
│       │   ├── PaymentsPage.tsx      # Extrato de pagamentos
│       │   └── ProfilePage.tsx       # Editar perfil
│       ├── components/
│       │   └── layout/Layout.tsx     # Nav + auth guard
│       ├── hooks/
│       │   ├── useAuth.ts            # Context de autenticação
│       │   └── useApp.ts             # Context global
│       └── lib/
│           └── api.ts                # Axios + interceptor JWT
│
├── android/                           # App Android (Kotlin)
│   └── app/src/main/java/com/psaaraucaria/
│       ├── MainActivity.kt           # Entry point
│       ├── data/
│       │   ├── local/
│       │   │   ├── AppDatabase.kt    # Room database
│       │   │   ├── dao/TreeDao.kt    # Queries locais
│       │   │   └── entity/           # Entidades SQLite
│       │   └── remote/
│       │       ├── api/PsaApi.kt     # Retrofit interface
│       │       └── api/RetrofitClient.kt
│       ├── sync/
│       │   └── SyncWorker.kt        # WorkManager (offline)
│       └── ui/
│           ├── screens/MapScreen.kt  # Tela de mapa + árvores
│           ├── components/TreeMapView.kt
│           └── theme/Theme.kt
│
├── .github/workflows/
│   └── android-build.yml             # CI: build APK automático
│
├── docker-compose.yml                # Postgis + Redis + API
└── README.md
```

---

## Modelo de Dados (10 tabelas)

```
producers (produtores rurais)
  ├── properties (imóveis com geojson)
  ├── contracts (contratos por modalidade)
  │   ├── trees (araucárias com lat/long)
  │   ├── payments (parcelas)
  │   └── complementary_activities
  └── training_attendance (capacitações)
```

### Modalidades de Contrato

| Modalidade      | Descrição                                    |
| --------------- | -------------------------------------------- |
| CONSERVACAO     | Conservação de araucárias existentes         |
| PLANTIO_LIVRE   | Plantio de araucárias em área livre          |
| APP             | Adequação de Área de Preservação Permanente  |
| POMAR           | Implantação de pomar de araucárias           |

---

## Como Rodar

### Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma db push
npm run start:dev
```

API disponível em `http://localhost:3000`.  
Swagger em `http://localhost:3000/api/docs`.

### Web

```bash
cd web
npm install
npm run dev
```

Acessar `http://localhost:5173`.  
Requisições para `/api/*` são proxyadas para `localhost:3000`.

### Android

O APK é buildado automaticamente via **GitHub Actions** ao fazer push na branch `main`.  
Baixar em: **Actions > android-build > artifact > app-debug.apk**.

Para build manual (precisa do Android SDK):

```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
```

APK em `android/app/build/outputs/apk/debug/app-debug.apk`.

#### Conectando ao backend

No emulador Android: `http://10.0.2.2:3000` (já configurado).  
No celular físico: editar `RetrofitClient.kt` com o IP do servidor na rede local.

---

## API Endpoints

### Auth

| Método | Rota             | Descrição            |
| ------ | ---------------- | -------------------- |
| POST   | `/auth/login`    | Login (return JWT)   |
| POST   | `/auth/register` | Cadastro produtor    |
| POST   | `/auth/refresh`  | Refresh token        |

### Producers (protegido)

| Método | Rota               | Descrição          |
| ------ | ------------------ | ------------------ |
| GET    | `/producers`        | Listar produtores  |
| GET    | `/producers/:id`    | Detalhe            |
| POST   | `/producers`        | Criar              |
| PUT    | `/producers/:id`    | Atualizar          |
| DELETE | `/producers/:id`    | Remover            |

### Contracts (protegido)

| Método | Rota                                | Descrição               |
| ------ | ----------------------------------- | ----------------------- |
| GET    | `/contracts`                        | Listar todos            |
| GET    | `/contracts/active`                 | Contratos ativos        |
| GET    | `/contracts/producer/:producerId`   | Por produtor (c/ trees) |
| POST   | `/contracts`                        | Criar                   |
| PATCH  | `/contracts/:id/status`             | Alterar status          |

### Trees (protegido)

| Método | Rota                       | Descrição                    |
| ------ | -------------------------- | ---------------------------- |
| GET    | `/trees/contract/:id`      | Árvores de um contrato       |
| POST   | `/trees`                   | Criar árvore                 |
| POST   | `/trees/batch`             | Criar em lote (sinc Android) |
| PUT    | `/trees/:id/verify`        | Verificar (foto + status)    |

### Payments (protegido)

| Método | Rota                               | Descrição            |
| ------ | ---------------------------------- | -------------------- |
| GET    | `/payments/contract/:contractId`   | Parcelas do contrato |
| GET    | `/payments/producer/:producerId`   | Por produtor         |
| GET    | `/payments/upcoming/:producerId`   | Próximos vencimentos |

### Sync (protegido)

| Método | Rota           | Descrição                      |
| ------ | -------------- | ------------------------------ |
| POST   | `/sync/upload` | Enfileira lote para sincronizar |

### Media (protegido)

| Método | Rota            | Descrição          |
| ------ | --------------- | ------------------ |
| POST   | `/media/upload` | Upload de foto (S3) |

---

## Arquitetura Offline (Android)

Fluxo de funcionamento do app Android em campo:

```
Técnico abre app → baixa contratos ativos → Room (SQLite)
     ↓
Coleta árvores (GPS) + fotos → salva LOCALMENTE (sync_status = 'PENDING')
     ↓
WiFi disponível? ─sim→ WorkManager → POST /trees/batch → marca como SYNCED
     └──não──→ fica no SQLite até ter sinal
```

**Room** armazena: árvores, contratos, fotos.  
**WorkManager** sobe em background com backoff exponencial.  
**Mapbox** baixa tiles offline da região de Cunha/SP.

---

## CI/CD

Ao fazer push na `main`, o GitHub Actions:
1. Sobe máquina Ubuntu + JDK 17 + Android SDK
2. Builda `assembleDebug`
3. Gera artifact com `app-debug.apk`

O workflow está em `.github/workflows/android-build.yml`.

---

## Segurança

- JWT com expiração de 1h + refresh token de 7d
- Senhas armazenadas com hash (via Prisma)
- Rotas protegidas com `@UseGuards(AuthGuard('jwt'))`
- Upload de fotos criptografado em trânsito (HTTPS) pelo S3
- `.env` e `*_key*` no `.gitignore`
- CORS habilitado para desenvolvimento
