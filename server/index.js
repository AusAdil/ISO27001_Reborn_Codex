const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const questions = require('./data/questions');
const learning = require('./data/learning');
const { calculateAssessment } = require('./utils/scoring');
const { readBaseline, writeBaseline, resetBaseline } = require('./utils/baselineStore');

const PORT = process.env.PORT || 4000;
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadDir();
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(safeName);
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({ storage });

const onboardingOptions = {
  organisationSizes: ['1-50', '51-250', '251-1000', '1000+'],
  industries: ['SaaS', 'Healthcare', 'Finance', 'Government', 'Education', 'Other'],
  hostingModels: [
    { id: 'cloud', label: 'Cloud' },
    { id: 'on-prem', label: 'On-premises' }
  ],
  supplierReliance: ['Low', 'Medium', 'High'],
  criticalAssets: [
    'Customer data',
    'Personal data (PII)',
    'Protected health information (PHI)',
    'Payment card information (PCI)',
    'Intellectual property (IP)',
    'Operational technology',
    'Financial records and reporting',
    'Employee records'
  ],
  annexAControls: questions
    .filter((question) => question.id.startsWith('A.'))
    .map((question) => ({ id: question.id, label: question.control }))
};

function formatScoreResponse(assessment, baseline, options = {}) {
  const { preview = false } = options;
  const completionRatio = assessment.inScopeCount > 0 ? assessment.answeredCount / assessment.inScopeCount : 0;
  const responseBaseline = baseline || { overall: null, themes: {} };

  let nextBaseline = responseBaseline;
  if (!preview && responseBaseline.overall === null && completionRatio >= 0.8 && assessment.overall.denominator > 0) {
    nextBaseline = {
      overall: +assessment.overall.latest.toFixed(4),
      themes: Object.fromEntries(assessment.themes.map((theme) => [theme.theme, +theme.latest.toFixed(4)]))
    };
    writeBaseline(nextBaseline);
  }

  const themes = assessment.themes.map((theme) => ({
    theme: theme.theme,
    latest: +theme.latest.toFixed(4),
    baseline: nextBaseline.themes[theme.theme] ?? null,
    answered: theme.answered,
    inScope: theme.inScope
  }));

  return {
    completionRatio: +completionRatio.toFixed(4),
    overall: {
      latest: +assessment.overall.latest.toFixed(4),
      baseline: nextBaseline.overall,
      numerator: assessment.overall.numerator,
      denominator: assessment.overall.denominator
    },
    answeredCount: assessment.answeredCount,
    inScopeCount: assessment.inScopeCount,
    themes,
    items: assessment.items.map((item) => ({
      id: item.id,
      clause: item.clause,
      control: item.control,
      theme: item.theme,
      text: item.text,
      criticality: item.criticality,
      impact: item.impact,
      defaultScope: item.defaultScope,
      inScope: item.inScope,
      answered: item.answered,
      skipped: item.skipped,
      answer: item.answer,
      scopeFactor: +item.scopeFactor,
      effectiveWeight: item.effectiveWeight,
      weightForDenominator: item.weightForDenominator,
      fraction: item.fraction,
      notes: item.notes,
      evidence: item.evidence,
      evidenceVerified: item.evidenceVerified,
      dependencies: item.dependencies
    })),
    gaps: assessment.gaps.map((gap) => ({
      id: gap.id,
      title: gap.title,
      description: gap.description,
      action: gap.action,
      severityScore: gap.severityScore,
      band: gap.band,
      severityLabel: gap.severityLabel,
      effort: {
        tech: +gap.effort.tech.toFixed(1),
        people: +gap.effort.people.toFixed(1),
        time: {
          min: +gap.effort.time.min.toFixed(1),
          max: +gap.effort.time.max.toFixed(1)
        }
      },
      dependencies: gap.dependencies,
      fractionGap: gap.fractionGap,
      theme: gap.theme,
      notes: gap.notes,
      evidence: gap.evidence
    })),
    roadmap: assessment.roadmap.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      action: item.action,
      band: item.band,
      severityLabel: item.severityLabel,
      severityScore: item.severityScore,
      effort: item.effort,
      dependencies: item.dependencies,
      fractionGap: item.fractionGap,
      theme: item.theme,
      notes: item.notes,
      evidence: item.evidence
    }))
  };
}

function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  ensureUploadDir();
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/onboarding-options', (_req, res) => {
    res.json(onboardingOptions);
  });

  app.get('/api/questions', (_req, res) => {
    res.json(questions);
  });

  app.get('/api/learning', (_req, res) => {
    res.json(learning);
  });

  app.post('/api/score', (req, res) => {
    try {
      const { onboarding = {}, answers = [], preview = false } = req.body || {};
      const baseline = readBaseline();
      const assessment = calculateAssessment(questions, answers, onboarding, { excludeUnanswered: true });
      const response = formatScoreResponse(assessment, baseline, { preview });
      res.json(response);
    } catch (error) {
      res.status(400).json({ error: error.message || 'Unable to calculate score' });
    }
  });

  app.post('/api/roadmap', (req, res) => {
    try {
      const { onboarding = {}, answers = [] } = req.body || {};
      const assessment = calculateAssessment(questions, answers, onboarding, { excludeUnanswered: true });
      res.json({ roadmap: assessment.roadmap, gaps: assessment.gaps });
    } catch (error) {
      res.status(400).json({ error: error.message || 'Unable to generate roadmap' });
    }
  });

  app.post('/api/uploads', upload.single('file'), (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    res.json({ fileId: req.file.filename, filename: req.file.originalname });
  });

  app.get('/api/uploads/:id', (req, res) => {
    const filePath = path.join(UPLOAD_DIR, req.params.id);
    if (!filePath.startsWith(UPLOAD_DIR)) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.sendFile(filePath);
  });

  app.post('/api/baseline/reset', (_req, res) => {
    resetBaseline();
    res.json({ status: 'reset' });
  });

  const distPath = path.join(__dirname, '..', 'client', 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

if (require.main === module) {
  if (process.argv.includes('--test')) {
    const sampleAssessment = calculateAssessment(
      questions,
      questions.slice(0, 5).map((question, index) => ({
        id: question.id,
        answer: index % 2 === 0 ? 'yes' : 'partial'
      })),
      {
        organisationSize: '51-250',
        hostingModel: ['cloud'],
        supplierReliance: 'Medium',
        criticalAssets: ['Customer data'],
        locations: ['Sydney'],
        remoteWork: true
      },
      { excludeUnanswered: true }
    );
    console.log(
      JSON.stringify(
        {
          status: 'ok',
          sampleScore: +sampleAssessment.overall.latest.toFixed(4),
          answered: sampleAssessment.answeredCount,
          inScope: sampleAssessment.inScopeCount
        },
        null,
        2
      )
    );
    process.exit(0);
  }

  const app = createServer();
  app.listen(PORT, () => {
    console.log(`ISO 27001 readiness API running on port ${PORT}`);
  });
}

module.exports = createServer;
