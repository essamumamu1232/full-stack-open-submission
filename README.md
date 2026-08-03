# Full Stack Open – Experiment Workspace

This repository contains a minimal, premium‑styled static site that documents the required parts 8‑14 of the Full Stack Open course.

## Table of Contents
| Part | Description |
|------|-------------|
| [Part 8 – GraphQL (Client)](part8.html) | Apollo Client example |
| [Part 9 – GraphQL (Server)](part9.html) | Apollo Server example |
| [Part 10 – Testing](part10.html) | Jest test example |
| [Part 11 – TypeScript](part11.html) | TS config and component |
| [Part 12 – Docker](part12.html) | Dockerfile & compose |
| [Part 13 – CI/CD](part13.html) | GitHub Actions workflow |
| [Part 14 – Deployment](part14.html) | GitHub Pages deployment |

## Build & Run
```bash
npm install          # install Vite
npm run dev          # start dev server (http://localhost:5173)
npm run build        # generate static site in ./dist
```

## Link Check
```bash
node scripts/check_links.js   # fails if any internal link is broken
```

## Deployment (GitHub Pages)
1. Push the repo to GitHub.
2. In repository settings enable **GitHub Pages** source `gh‑pages` (or `main` / `./dist`).
3. The site will be available at `https://<username>.github.io/full-stack-open-submission/`.
