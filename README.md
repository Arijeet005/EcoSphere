# EcoSphere — ESG Management Platform

An ERP-integrated platform for organizations to measure, manage, and improve their
Environmental, Social, and Governance (ESG) performance.

---

## Problem

ESG data typically lives scattered across departments in spreadsheets and disconnected systems.
Reporting is manual, error-prone, and reactive — teams scramble before audits instead of
tracking performance continuously. EcoSphere centralizes environmental, social, and governance
tracking into one live dashboard, with gamification to drive employee participation.

---

## Modules

| Module | Status |
|---|---|
| Auth & Role-Based Access Control | ✅ Live |
| Environmental — Emission Factors, Carbon Transactions, Environmental Dashboard | ✅ Live |
| Social — CSR Activities, Employee Participation (submit/approve) | ✅ Live |
| Governance — Compliance Issues (with overdue flagging) | ✅ Live |
| Gamification — Challenges, Challenge Participation, XP, Badge Auto-Award, Leaderboard | ✅ Live |
| ESG Scoring Engine — weighted Environmental/Social/Governance score (40/30/30, configurable) | ✅ Live |
| Executive Dashboard — score tiles, emissions trend, department ranking, activity feed | ✅ Live |
| Product ESG Profiles, Environmental Goals, Diversity Dashboard, Audits, Policies, Rewards, Reports | 🟡 UI-complete, static sample data (see [Scope Decisions](#scope-decisions)) |

---

## Tech Stack

**Frontend:** React (Vite), React Router, Axios, Recharts, TailwindCSS
**Backend:** Node.js, Express
**Database:** PostgreSQL with Prisma ORM
**Auth:** JWT + bcrypt
**AI/Logic layer:** Rule-based ESG scoring engine + badge auto-award rule evaluator (see [AI Features](#ai-features))

No BaaS (Firebase/Supabase), no blockchain — auth, database, and business logic are all built
from scratch to keep the stack understandable and defensible.

---

## Architecture

```
React (client) ──HTTP──► Express (server) ──Prisma──► PostgreSQL
                              │
                              ├─► services/scoringService.js   (ESG score calculation)
                              ├─► services/scoreAggregator.js  (raw data → sub-scores)
                              └─► services/badgeEngine.js      (rule-based badge unlock)
```

All computation stays inside the Express backend — no separate microservice was needed, since
both the scoring engine and badge logic are deterministic, rule-based functions rather than
trained models.

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL running locally or a connection string

### Setup
```bash
# clone and install
git clone <repo-url>
cd ecosphere
npm install          # installs root-level concurrently
cd server && npm install
cd ../client && npm install
cd ..

# environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env
# fill in DATABASE_URL, JWT_SECRET, VITE_API_URL

# database
cd server
npx prisma migrate dev
npx prisma db seed
cd ..

# run everything
npm run dev
```

This starts the client (default `http://localhost:5173`) and server (default `http://localhost:3000`) together.

### Demo login
After seeding, use:
- **Manager:** `manager@ecosphere.demo` / `password123`
- **Employee:** `employee@ecosphere.demo` / `password123`

(Change these before any real deployment — seed credentials are for demo purposes only.)

---

## AI Features

EcoSphere includes two lightweight, fully-explainable logic features rather than a heavy ML
pipeline — chosen deliberately so every part of the system is defensible and auditable:

1. **ESG Scoring Engine** (`services/scoringService.js`) — computes a department's total ESG
   score as a weighted average of its Environmental, Social, and Governance sub-scores, using
   a default weighting (Environmental 40% / Social 30% / Governance 30%), configurable via
   environment variable. Sub-scores are derived from real operational data: emissions totals,
   CSR participation approval rates, and compliance issue resolution rates.

2. **Badge Auto-Award Engine** (`services/badgeEngine.js`) — evaluates each badge's unlock rule
   (e.g. XP threshold, completed-challenge count) against a user's current stats after any
   XP-increasing action, and auto-assigns newly-unlocked badges with no manual admin step.

Both are deterministic and auditable by design — appropriate for a compliance-adjacent feature
where "why did this happen" needs a clear answer, not a black-box explanation.

---

## Database Design

PostgreSQL schema (via Prisma) includes 13 normalized tables across master and transactional
data — Departments, Categories, Emission Factors, Badges, Rewards as master data; Carbon
Transactions, CSR Activities, Employee Participation, Challenges, Challenge Participation,
Compliance Issues, and Department Scores as transactional data — with proper foreign key
relationships (including a self-relation on Department for parent/child hierarchy), enums for
status fields, and indexes on frequently-queried foreign keys and dates.

Full schema: [`server/prisma/schema.prisma`](server/prisma/schema.prisma)

---

## Scope Decisions

The full product vision covers a much larger surface area than what's currently built (full
Audit lifecycle, Policy management, Notification system, Custom Report Builder with PDF/Excel
export, Reward redemption). Current priorities:

1. Build the **complete navigation and information architecture** to match the intended
   platform exactly, so every module is visible and browsable.
2. Make the modules that best demonstrate **database design, RBAC, and real business logic**
   fully live: Carbon Tracking, CSR Participation, Compliance Issues, Gamification, and Scoring.
3. Leave lower-priority modules (Audits, Policies, Rewards, Product ESG Profiles, Reports)
   as polished, static UI with representative sample data — the schema anticipates all of them,
   and wiring them up is a matter of further development.

The goal is a smaller set of features working correctly end-to-end over a larger set that looks
complete but breaks under real interaction.

---

## Known Limitations
- Overall ESG score is a simple average across departments (not weighted by employee count)
- Static tabs use hardcoded sample data, not connected to the database
- No automated test suite — manual smoke testing only
- Report export (PDF/Excel/CSV) is UI-only, not functional

---

## Roadmap
- Wire remaining static modules (Audits, Policies, Product ESG Profiles, Rewards) to the database
- Build the Notification System (in-app + email) per the configured triggers in Settings
- Implement Custom Report Builder with real PDF/Excel/CSV export
- Weight the overall ESG score by department employee count
- Add automated test coverage for scoring and badge-award logic
