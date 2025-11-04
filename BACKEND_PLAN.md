# Backend Plan — Uni Grade & Exam Management (Local, Private)

Overview
- Purpose: Implement a secure, modular backend providing REST APIs for Students, Faculty, Admins, Courses, Subjects, Exams, Marks, Results, Notifications, PDF generation and verification — all running locally (Docker Compose).
- Tech stack: Node.js + TypeScript, NestJS (recommended) or Express, PostgreSQL, Redis (optional for queue/session), BullMQ for jobs, MailHog for local email, Puppeteer for PDF generation, mkcert TLS for localhost.

Goals
- Role-based access control (Admin, Faculty, Student).
- Strong validation, audit logs, and secure local-only configuration.
- Background job processing for heavy tasks (PDF generation, email).
- Local file storage for uploads and generated PDFs.
- Well-documented API (OpenAPI/Swagger) and tests.

Project Structure (recommended - NestJS)
- backend/
  - src/
    - main.ts
    - app.module.ts
    - auth/
      - auth.module.ts
      - auth.controller.ts
      - auth.service.ts
      - jwt.strategy.ts
      - local.strategy.ts
    - users/
      - users.module.ts
      - users.controller.ts
      - users.service.ts
      - users.entity.ts
    - students/ faculties/ admins/ courses/ subjects/ exams/ marks/ results/
      - each module: module, controller, service, dto, entity, repository
    - notifications/
    - pdf/
      - pdf.service.ts (Puppeteer)
    - jobs/
      - queue.module.ts (BullMQ)
      - processors/
    - common/
      - guards/roles.guard.ts
      - interceptors/audit.interceptor.ts
      - filters/http-exception.filter.ts
    - config/
      - configuration.ts (load .env)
    - migrations/ (TypeORM or Prisma migrations)
  - test/
  - package.json
  - tsconfig.json

Key Backend Decisions
- Framework: NestJS with TypeORM or Prisma ORM (Prisma recommended for DX). Use strict TypeScript.
- Auth: JWT short-lived access tokens (15m) + refresh tokens (7–30d) as HttpOnly secure cookies. For local dev with mkcert use secure cookies.
- Password hashing: argon2 or bcrypt (argon2 preferred).
- Validation: class-validator and class-transformer (NestJS DTOs).
- Logging: Winston or built-in Nest logger; include correlation IDs.
- Auditing: store audit logs for create/update/delete with user id and metadata.
- API docs: Swagger via @nestjs/swagger.

Endpoints (high level)
- /api/v1/auth
  - POST /login
  - POST /refresh
  - POST /logout
  - POST /forgot-password
  - POST /reset-password
- /api/v1/users
  - GET /me
  - PATCH /me
  - Admin CRUD endpoints
- /api/v1/students, /faculties, /courses, /subjects, /exams, /exam-sessions
- /api/v1/marks
  - POST /marks (faculty bulk/single)
  - PATCH /marks/:id
  - GET /marks?student_id=&exam_id=
- /api/v1/results
  - POST /results/generate (background job)
  - GET /results/:student_id?semester=
  - GET /results/:id/pdf
  - POST /results/:id/publish
- /api/v1/notifications
- /api/v1/admin/analytics and /admin/rankings

Background Jobs
- Use BullMQ + Redis
  - jobs: generate-result-pdf, send-email, generate-rankings
- Worker processes: separate process (docker service `worker`)

PDF Generation & Verification
- Puppeteer render HTML template -> PDF saved to local volume `./data/pdfs`.
- Embed QR code containing verification token.
- Store verification record in DB with token, signed HMAC of data, and timestamp.
- Verification endpoint: /verify/:token -> returns signed metadata if valid.

Database & Migrations
- Use Prisma or TypeORM migrations.
- Keep migrations in repo and run on `docker compose up` or via Makefile target `make migrate`.

Local Development
- Use Docker Compose with services: api, worker, postgres, redis, mailhog.
- Use .env.local for secrets (not committed).
- Use mkcert TLS certs and bind hostnames (api.grade.local) to 127.0.0.1 in /etc/hosts.

Testing Strategy
- Unit tests: Jest.
- Integration tests: Supertest against a test DB instance (Docker).
- E2E tests: Playwright/Cypress that run next to Docker compose or via GitHub Actions (optional, local-only runs recommended).

Security (Local)
- Enforce HTTPS, secure cookies with mkcert certs.
- Keep services bound to 127.0.0.1 by default.
- Use least privilege for DB user credentials.
- Regular local backups and encrypted storage.

Developer scripts & Makefile targets
- make up, make down, make migrate, make seed, make backup-db, make restore-db

Notes
- Keep all secrets and backups off of public storage.
- Document local setup in README.local.md and onboarding scripts.