# ISO 27001 Readiness Navigator

This repository contains a lightweight MVP comprising a Node.js API and a single-page React experience (served via CDN) that helps first-time teams baseline their ISO 27001:2022 readiness.

## Project structure

```
/README.md              — Getting started guide
/package.json           — Node configuration for the API
/server/                — Lightweight HTTP API and scoring engine
  ├─ data/questions.js  — Seed assessment catalogue (46 controls)
  ├─ data/learning.js   — Plain-English learning snippets
  └─ utils/scoring.js   — Weighted scoring, gap and roadmap logic
/client/index.html      — React front-end using CDN builds
```

## Features

- Onboarding wizard that adjusts scope (hosting, suppliers, critical assets) and removes out-of-scope questions from scoring.
- Assessment of 46 representative ISO 27001:2022 clauses and Annex A controls with Yes/No/Partial and 1–5 maturity scales.
- Weighted scoring model (Scope × Criticality × Impact) with transparent weightings.
- Gap analysis with scaled effort estimates (tech, people, time) and severity bands.
- Roadmap generation that orders Quick Wins → Medium → Long-term while honouring dependencies.
- Dashboard visualisation with overall score, themed results, gap summary, next actions, and baseline comparison.
- One-page PDF export summarising scores, top gaps and next actions.
- Learning hub translating each clause/control into “what / why / how”.

## Prerequisites

- Node.js 18+
- npm (for running the API). No npm install is required because the project uses the built-in HTTP module and CDN-delivered React.

## Running the API

```bash
npm start
```

The API will listen on [http://localhost:4000](http://localhost:4000) and provides the following endpoints:

- `GET /api/onboarding-options`
- `GET /api/questions`
- `GET /api/learning`
- `POST /api/assess`

## Launching the front-end

Open `client/index.html` in a browser (e.g. via a simple static server or using the Live Preview of your editor). The page expects the API to be reachable on `http://localhost:4000`.

## Running the lightweight test harness

```bash
npm test
```

The test command runs the scoring engine against a sample payload and prints the resulting overall score to confirm everything is wired correctly.

## PDF export

The dashboard uses [jsPDF](https://github.com/parallax/jsPDF) from a CDN to generate a single-page summary (overall score, themes, top 10 gaps, top 10 roadmap actions).

## Accessibility and language

- The UI follows accessible defaults with labelled form fields, keyboard support and ARIA states for key widgets.
- All copy uses Australian English (organisation, prioritised, visualise).

## Next steps

Future enhancements could include persistent storage, evidence capture, industry benchmarks and integration hooks for identity, ticketing or SIEM platforms.
