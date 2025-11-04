# Frontend Plan — Uni Grade & Exam Management (Local, Private)

Overview
- Tech: Next.js + TypeScript (recommended), Tailwind CSS, React Query (TanStack Query) for server state, React Hook Form + Zod for validation, Chart.js or Recharts for charts.
- Goals: Role-based interfaces (Admin, Faculty, Student) within single app with role-guarded routes. Local-only operation (connect to local API over HTTPS with mkcert certs).

Project Structure (recommended)
- frontend/
  - public/
  - src/
    - pages/
      - _app.tsx, _document.tsx
      - auth/
        - login.tsx
        - forgot.tsx
      - admin/
        - dashboard.tsx
        - users.tsx
        - courses.tsx
        - subjects.tsx
        - results-generate.tsx
      - faculty/
        - dashboard.tsx
        - marks-entry/[subjectId].tsx
        - sessions.tsx
      - student/
        - dashboard.tsx
        - results.tsx
        - cgpa-calculator.tsx
      - verify/
        - [token].tsx (QR verification page)
    - components/
      - layout/
        - Navbar.tsx, Sidebar.tsx, Footer.tsx
      - ui/
        - Button.tsx, Modal.tsx, Table.tsx, FormInput.tsx
      - admin/, faculty/, student/ (domain components)
      - charts/
    - hooks/
      - useAuth.ts, useRole.ts, useToast.ts
    - services/
      - api.ts (axios instance), authService.ts, studentsService.ts, marksService.ts
    - styles/
      - globals.css (Tailwind)
    - utils/
      - format.ts, validators.ts, pdfHelpers.ts
  - next.config.js
  - tailwind.config.js
  - package.json
  - tsconfig.json

Routing & RBAC
- Use Next.js middleware or client-side guards to redirect users to role-specific dashboard upon login.
- Protect pages server-side where appropriate (getServerSideProps) to validate session on initial load.

Key UI Patterns
- Dashboard layout with collapsible sidebar and role-specific nav.
- Bulk CSV upload component for students and marks (drag-and-drop, parse with PapaParse).
- Inline editable table for marks entry with autosave, validations and pending state.
- Preview modal for PDF marksheet before publishing.
- Modals for confirmations (publish, delete, approve).
- Toast notifications for success/error (client-side).

Data Fetching & State
- React Query for all server data; cache and invalidation on mutations (e.g., after marks submit).
- Global auth context or use React Query + secure cookie auth tokens via axios interceptors.
- Optimistic updates for UX on marks entry (with rollback on failure).

Forms & Validation
- React Hook Form + Zod schema validation for consistent validation both client and server.
- Client-side checking of max marks per subject and credit values.

PDF & Verification
- Fetch PDF from /api/v1/results/:id/pdf -> open in new tab or download.
- Verify QR tokens by calling GET /api/v1/verify/:token and render result.

Local Development
- Serve Next.js dev: `pnpm dev` or `npm run dev` on https://grade.local:3000 (mkcert).
- Use env.local to point NEXT_PUBLIC_API_URL=https://api.grade.local:4000

Testing
- Unit: React Testing Library + Jest.
- E2E: Playwright recommended for running local browser tests against Docker-based backend.

Build & Local Run
- Local dev: next dev
- Build for local static serve: next build && next start (serve over HTTPS with mkcert certs)

UX Considerations
- Accessibility (A11y) basics, keyboard navigation, color contrast.
- Responsive UI with mobile-first CSS.
- Export to CSV and print-friendly HTML for marksheets.

Documentation
- README.local.md with steps to run frontend, set env vars, mkcert instructions and seed admin user steps.