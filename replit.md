# TechCorp RMS — Enterprise Resource Management System

A production-quality, frontend-only SaaS app for IT consulting companies to manage 120 employees, 35 projects, allocations, skill gaps, and reports. Built as a demo-ready React + Vite application with mock API services.

## Run & Operate

- `pnpm --filter @workspace/rms-app run dev` — run the RMS app (served via workflow)
- `pnpm --filter @workspace/rms-app run typecheck` — typecheck the frontend
- Workflow: `artifacts/rms-app: web` — starts the Vite dev server

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React 18 + Vite, wouter (routing), Framer Motion (animations)
- shadcn/ui + Radix UI, Tailwind CSS v4
- Recharts (charts), react-hook-form, cmdk (command palette)
- No backend, no database — all mock services with simulated delays

## Where things live

```
artifacts/rms-app/src/
├── types/index.ts         — all TypeScript types (Employee, Project, Allocation, etc.)
├── constants/index.ts     — status colors, nav items, department lists
├── data/                  — static mock data (120 employees, 35 projects, etc.)
├── services/              — mock API services (replace return statements for real API)
├── hooks/                 — useEmployees, useProjects, useDashboard, useCommandPalette
├── utils/format.ts        — formatCurrency, formatDate, timeAgo, getInitials
├── components/            — StatusBadge, SkillBadge, MetricCard, ChartCard, CommandPalette, EmployeePanel, ProjectDrawer, etc.
├── layouts/AppLayout.tsx  — collapsible sidebar + top bar + command palette
├── pages/                 — Dashboard, Employees, Projects, Allocation, SkillGap, Reports, Notifications, Settings, Login
└── App.tsx                — routing (wouter), auth guard, login/logout state
```

## Architecture decisions

- **Frontend-only with mock services**: All services in `src/services/` simulate real API calls with 200–600ms delays. To connect to a Java Spring Boot backend, replace only the `return` statements in each service function.
- **No auth library**: Auth state stored in `localStorage["rms_auth"]`, hardcoded credential: `admin@techcorp.com` / `Admin@123`.
- **wouter** for routing (not react-router-dom) — `base={import.meta.env.BASE_URL}` handles Replit path routing.
- **Framer Motion** for all page transitions, card animations, sidebar collapse, and side panels.
- **cmdk** for the command palette (Ctrl+K / ⌘K), searches employees and projects in real time.

## Product

- **Login page** — split-panel with brand stats, demo credentials hint
- **Dashboard** — 6 KPI cards, 5 charts (area, bar, pie, donut, progress bars), AI insights, activity feed, rolloff alerts
- **Employees** — 120-employee table with search, filters, sort, pagination, Framer Motion slide-in detail panel with tabs (Overview / Allocations / Timeline)
- **Projects** — 35-project table with search, filters, Framer Motion drawer with team, milestones, progress, risk
- **Smart Allocation** — AI-powered matching: select a pending request → see top 5 ranked candidates with match %, skill match/gap, reasons, one-click confirm
- **Skill Gap** — 3-tab view: Gap Analysis (critical gaps grid, bar chart, distribution), Demand Forecast (line chart), Dept Heatmap (color-coded table)
- **Reports** — 4 report types with metrics grid and data table, Excel/PDF export actions
- **Notifications** — 30 notifications with type/priority filters, mark-all-read, click-to-navigate
- **Settings** — 5-tab settings: Profile, Notifications, Appearance, Security, Integrations

## User preferences

- Indigo (#6366F1) accent color
- Dark navy sidebar
- Inter font
- Mock services must be replaceable by only changing `return` statements (no structural changes needed)
- No auth libraries, no backend, no database

## Gotchas

- Data constants (`const depts`, `const clients`, etc.) in `data/projects.ts` must be declared BEFORE the `projects` array to avoid `ReferenceError` with `const`.
- All `TimelineEvent` type arrays need `as const` on the `type` field literals to satisfy the union type.
- The wouter `Router` base must strip trailing slash: `import.meta.env.BASE_URL.replace(/\/$/, "")`.
- `pnpm run typecheck` (not `build`) for verifying the frontend — `build` needs workflow-provided `PORT`.
