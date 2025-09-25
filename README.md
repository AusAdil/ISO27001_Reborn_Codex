# ISO 27001 Readiness Navigator

This repository contains a lightweight Node.js + Express API and a modern React front-end (powered by Vite) that help first-time teams baseline their ISO 27001:2022 readiness, identify gaps and generate a prioritised roadmap.


## Project structure

```
/README.md              — Getting started guide
/package.json           — Node configuration for the API (no external deps required)
/server/                — Lightweight HTTP API and scoring engine
  ├─ data/questions.js  — Seed assessment catalogue (46 controls)
  ├─ data/learning.js   — Plain-English learning snippets
  ├─ data/baseline.json — Stores the persisted baseline result

  └─ utils/scoring.js   — Weighted scoring, gap and roadmap logic
/client/                — React SPA built with Vite
  ├─ index.html         — Vite entry point
  ├─ package.json       — Front-end tooling configuration
  └─ src/               — React components and styles
```

## Features

- **Onboarding wizard** that captures locations, scope boundaries and Annex A exclusions with chip inputs so multi-word sites (e.g. “Melbourne Head Office”) are preserved.
- **Assessment catalogue** of 46 representative ISO 27001:2022 clauses and Annex A controls with Yes/No/Partial and 1–5 maturity scales.
- **Dynamic weighting model** (Scope × Criticality × Impact) recomputed whenever scope changes, with in-UI transparency for the effective weight per control.
- **Evidence capture** supporting URLs and local file uploads, plus an “evidence verified” toggle that treats a maturity level of 4 as fully embedded.
- **Gap analysis** with scaled effort estimates (tech, people, time) and severity bands that carry notes and evidence indicators through to the roadmap and PDF export.
- **Roadmap generation** that orders Quick Wins → Medium → Long-term while honouring dependencies.
- **Dashboard visualisation** with overall score, themed results, gap summary, next actions and a persistent baseline comparison.
- **One-page PDF export** summarising scores, top gaps, next actions, notes and evidence call-outs.
- **Learning hub** translating each clause/control into “what / why / how”.

## Prerequisites

- Node.js 18+
- npm (Node package manager)

## Running the API

Install dependencies once and then start the API:

```bash
npm install

npm start
```

The API listens on [http://localhost:4000](http://localhost:4000) and exposes:

- `GET /api/onboarding-options`
- `GET /api/questions`
- `GET /api/learning`
- `POST /api/score`
- `POST /api/roadmap`
- `POST /api/uploads` and `GET /api/uploads/:id` for local evidence files
- `POST /api/baseline/reset`
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

The test command exercises the scoring engine against a sample payload and prints the resulting overall score to confirm everything is wired correctly. The API now depends on `express`, `cors` and `multer`, so `npm install` must succeed before running the harness.

## Scoring, baseline and denominator rules

- **Baseline** is captured automatically the first time you complete an assessment (≥80% of in-scope controls answered). It remains unchanged for subsequent runs unless you trigger `POST /api/baseline/reset` (exposed via the dashboard button).
- **Controls answered** counts only in-scope controls that have a response (answers marked “Skip” are excluded), so the denominator reflects active participation.
- **Overall and theme scores** weight only answered, in-scope controls. Unanswered controls do not dilute the score until you provide an answer, which encourages teams to work through the catalogue without being penalised mid-way.
- **Annex A exclusions** and scope factors reduce the effective weight to zero so excluded controls disappear from the denominator, roadmap and PDF export.

## Accessibility and language

- The UI uses labelled form fields, keyboard-friendly controls and ARIA states for key widgets.
- Copy adheres to Australian English (organisation, prioritised, visualise).

## Next steps

Future enhancements could include persistent storage, evidence capture, industry benchmarks and integration hooks for identity, ticketing or SIEM platforms.
