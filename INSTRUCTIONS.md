# HCAI Lab — IDG2671 Team 1

Live site: https://team1.ai-research.it.ntnu.no

---

## Run with Docker (recommended)

**Requirements:** Docker Desktop

```bash
docker compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:3001

---

## Run locally (without Docker)

**Requirements:** Node.js 18+

**Backend** (in one terminal):
```bash
cd backend
npm install
npm run dev
```

**Frontend** (in a separate terminal):
```bash
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## Deploy to production

**1. Build and push images to Docker Hub (run locally):**
```bash
docker build -t tuvakh/idg2671_hcai_frontend ./frontend
docker build -t tuvakh/idg2671_hcai_backend ./backend
docker push tuvakh/idg2671_hcai_frontend
docker push tuvakh/idg2671_hcai_backend
```

**2. SSH into the server and switch to the team user:**
```bash
ssh [your-ntnu-username]@ai-research.it.ntnu.no
su team1
```

**3. Pull the new images and restart:**
```bash
cd ~/app
docker compose -f remote-compose.yaml pull
docker compose -f remote-compose.yaml up -d
```

---

## Run tests

**Backend unit & API integration tests** (Jest):
```bash
cd backend
npm test
```

**Frontend component integration tests** (Vitest):
```bash
cd frontend
npm test
```

**End-to-end tests** (Puppeteer — requires the app to be running on http://localhost:5173):
```bash
npm run test:e2e
```

---

## Environment variables

The `docker-compose.yml` is pre-configured for local use.
For production, secrets are stored on the server and not committed to git.

---

## Information for delivery only (we know this should be private in a real project)
Admin password: HCAI2026
