# EcoSphere ESG Management Platform

A React + Express + PostgreSQL MVP scaffold for an ESG management platform built for a hackathon.

## Structure

- client/: Vite + React + Tailwind frontend
- server/: Express + Prisma backend

## Setup

1. Create a PostgreSQL database and update the connection string in server/.env.
2. Install dependencies:
   - cd server && npm install
   - cd client && npm install
3. Run Prisma migrations and generate the client:
   - cd server && npm run prisma:migrate
   - cd server && npm run prisma:generate
   - cd server && npm run prisma:seed
4. Start both apps:
   - cd server && npm run dev
   - cd client && npm run dev

## Notes

- The scaffold includes auth, metrics, compliance, and CSR skeletons.
- Seed data provides one department, two users, and sample ESG metrics.
