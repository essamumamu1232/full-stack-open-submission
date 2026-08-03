# Full Stack Open – Parts 8–14 Submission

A monorepo containing exercises from **Full Stack Open** parts 8–14 by the University of Helsinki.

## Repository Structure

| Folder | Part | Topic |
|--------|------|-------|
| `part8/` | Part 8 | GraphQL – Apollo Server + Apollo Client React app (Library App) |
| `part9/` | Part 9 | TypeScript – typed Express backend + React frontend |
| `part10/` | Part 10 | React Native – Expo mobile app |
| `part11/` | Part 11 | CI/CD – GitHub Actions pipeline |
| `part12/` | Part 12 | Containers – Docker + docker-compose |
| `part13/` | Part 13 | Relational Databases – Express + PostgreSQL + Sequelize |

## Running Each Part

### Part 8 – GraphQL
```bash
# Backend
cd part8/library-backend
npm install
npm start   # http://localhost:4000

# Frontend
cd part8/library-frontend
npm install
npm start   # http://localhost:3000
```

### Part 9 – TypeScript
```bash
cd part9
npm install
npm run dev   # http://localhost:3001
```

### Part 12 – Docker
```bash
cd part12
docker-compose up
```

### Part 13 – PostgreSQL
```bash
cd part13
# Configure DATABASE_URL in .env
npm install
npm run migrate
npm start
```

## Submission
Submitted via [Full Stack Open submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).
