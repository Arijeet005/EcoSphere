# EcoSphere ESG Management Platform

A React + Express + PostgreSQL MVP scaffold for an ESG management platform built for a hackathon.

## Three-service architecture

EcoSphere now runs as three separate services:

- client/: Vite + React frontend for the user experience
- server/: Express + Prisma backend for business logic and persistence in PostgreSQL
- ml-service/: FastAPI microservice for stateless ESG scoring and anomaly detection

This separation keeps the ML logic isolated so it can evolve independently, be scaled separately, and be explained clearly in a demo. The Python service is intentionally lightweight and uses simple rule-based logic today, but it is structured in a way that can later support more advanced ML workflows with scikit-learn, pandas, or similar tooling.

## Setup

1. Create a PostgreSQL database and update the connection string in server/.env.
2. Install dependencies:
   - cd server && npm install
   - cd client && npm install
   - cd ml-service && pip install -r requirements.txt
3. Run Prisma migrations and generate the client:
   - cd server && npm run prisma:migrate
   - cd server && npm run prisma:generate
   - cd server && npm run prisma:seed
4. Start all services together:
   - npm run dev

## Run individually

- Frontend: cd client && npm run dev
- Backend: cd server && npm run dev
- ML service: cd ml-service && uvicorn app.main:app --reload --port 8000

## Notes

- The scaffold includes auth, metrics, compliance, and CSR skeletons.
- Seed data provides one department, two users, and sample ESG metrics.
- The ML service is stateless and does not connect to the database; persistence remains in the Express + Prisma backend.
