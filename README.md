# ISO 27001 Readiness Navigator

This repository contains a lightweight Node.js API and a modern React front-end (powered by Vite) that help first-time teams baseline their ISO 27001:2022 readiness, identify gaps and generate a prioritised roadmap.

## Project structure

```
/README.md              — Getting started guide
/package.json           — Node configuration for the API (no external deps required)
/server/                — Lightweight HTTP API and scoring engine
  ├─ data/questions.js  — Seed assessment catalogue (46 controls)
  ├─ data/learning.js   — Plain-English learning snippets
  └─ utils/scoring.js   — Weighted scoring, gap and roadmap logic
/client/                — React SPA built with Vite
  ├─ index.html         — Vite entry point
  ├─ package.json       — Front-end tooling configuration
  └─ src/               — React components and styles
```

## Features

- **Onboarding wizard** that tailors scope (hosting, suppliers, critical assets) and removes out-of-scope questions from scoring.
- **Assessment catalogue** of 46 representative ISO 27001:2022 clauses and Annex A controls with Yes/No/Partial and 1–5 maturity scales.
- **Weighted scoring model** (Scope × Criticality × Impact) with a transparent weighting summary in the dashboard.
- **Gap analysis** with scaled effort estimates (tech, people, time) and severity bands.
- **Roadmap generation** that orders Quick Wins → Medium → Long-term while honouring dependencies.
- **Dashboard visualisation** with overall score, themed results, gap summary, next actions and baseline comparison.
- **One-page PDF export** summarising scores, top gaps and next actions.
- **Learning hub** translating each clause/control into “what / why / how”.

## Prerequisites

- Node.js 18+
- npm (Node package manager)

## Running the API

The API uses only built-in Node.js modules and does not require `npm install`.

```bash
npm start
```

The API listens on [http://localhost:4000](http://localhost:4000) and exposes:

- `GET /api/onboarding-options`
- `GET /api/questions`
- `GET /api/learning`
- `POST /api/assess`
- `GET /api/health`

## Running the React front-end

```bash
cd client
npm install
npm run dev
```

The Vite dev server runs on [http://localhost:5173](http://localhost:5173) and proxies API calls to `http://localhost:4000`.

To create an optimised production bundle:

```bash
npm run build
npm run preview
```

The API automatically serves files from `client/dist` when they exist.

## Running the lightweight test harness

```bash
npm test
```

The test command exercises the scoring engine against a sample payload and prints the resulting overall score to confirm everything is wired correctly.

## Accessibility and language

- The UI uses labelled form fields, keyboard-friendly controls and ARIA states for key widgets.
- Copy adheres to Australian English (organisation, prioritised, visualise).

## Next steps

Future enhancements could include persistent storage, evidence capture, industry benchmarks and integration hooks for identity, ticketing or SIEM platforms.