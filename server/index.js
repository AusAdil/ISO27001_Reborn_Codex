const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

const questions = require('./data/questions');
const learning = require('./data/learning');
const { calculateScores } = require('./utils/scoring');

const PORT = process.env.PORT || 4000;

const onboardingOptions = {
  organisationSizes: ['1-50', '51-250', '251-1000', '1000+'],
  industries: ['SaaS', 'Healthcare', 'Finance', 'Government', 'Education', 'Other'],
  hostingModels: ['cloud', 'on-prem'],
  supplierReliance: ['Low', 'Medium', 'High'],
  criticalAssets: ['Customer data', 'PHI', 'PCI', 'IP', 'Operational Tech']
};

function buildWeightSummary(questionSet) {
  return questionSet.map((question) => ({
    id: question.id,
    clause: question.clause,
    control: question.control,
    theme: question.theme,
    criticality: question.weight.criticality,
    impact: question.weight.impact,
    defaultScope: question.weight.defaultScope
  }));
}

function handleAssessment(body = {}) {
  const { onboarding = {}, responses = [] } = body;
  const scoring = calculateScores(questions, responses, onboarding);

  const baselineOverall = +(scoring.overallScore * 0.6).toFixed(1);
  const themedTrends = scoring.themeScores.map((themeScore) => ({
    theme: themeScore.theme,
    baseline: +(themeScore.score * 0.6).toFixed(1),
    latest: themeScore.score
  }));

  return {
    timestamp: new Date().toISOString(),
    onboarding,
    overall: {
      score: scoring.overallScore,
      baseline: baselineOverall,
      latest: scoring.overallScore
    },
    themes: themedTrends,
    breakdown: scoring.breakdown,
    gaps: scoring.gaps,
    roadmap: scoring.roadmap,
    weightings: buildWeightSummary(questions)
  };
}

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function handleOptions(res) {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600'
  });
  res.end();
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk.toString();
      if (raw.length > 5 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        resolve(parsed);
      } catch (error) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', (error) => reject(error));
  });
}

function serveStatic(req, res) {
  const distDir = path.join(__dirname, '..', 'client', 'dist');
  if (!fs.existsSync(distDir)) {
    return false;
  }

  const filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url.replace(/^\//, ''));
  if (!filePath.startsWith(distDir)) {
    return false;
  }

  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      return false;
    }
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      res.writeHead(500);
      res.end('Internal Server Error');
    });

    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, {
      'Content-Type': types[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*'
    });
    stream.pipe(res);
    return true;
  } catch (error) {
    return false;
  }
}

function createServer() {
  const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'OPTIONS') {
      handleOptions(res);
      return;
    }

    if (parsedUrl.pathname === '/api/health') {
      sendJson(res, 200, { status: 'ok' });
      return;
    }

    if (parsedUrl.pathname === '/api/questions' && req.method === 'GET') {
      sendJson(res, 200, questions);
      return;
    }

    if (parsedUrl.pathname === '/api/onboarding-options' && req.method === 'GET') {
      sendJson(res, 200, onboardingOptions);
      return;
    }

    if (parsedUrl.pathname === '/api/learning' && req.method === 'GET') {
      sendJson(res, 200, learning);
      return;
    }

    if (parsedUrl.pathname === '/api/assess' && req.method === 'POST') {
      try {
        const body = await parseBody(req);
        const response = handleAssessment(body);
        sendJson(res, 200, response);
      } catch (error) {
        sendJson(res, 400, { error: error.message });
      }
      return;
    }

    if (serveStatic(req, res)) {
      return;
    }

    if (req.method === 'GET' && fs.existsSync(path.join(__dirname, '..', 'client', 'dist', 'index.html'))) {
      const indexPath = path.join(__dirname, '..', 'client', 'dist', 'index.html');
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(indexPath).pipe(res);
      return;
    }

    res.writeHead(404, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ error: 'Not Found' }));
  });

  return server;
}

if (require.main === module) {
  if (process.argv.includes('--test')) {
    const sample = handleAssessment({
      onboarding: {
        organisationSize: '51-250',
        hostingModel: ['cloud'],
        supplierReliance: 'Medium',
        criticalAssets: ['Customer data'],
        locations: ['Sydney'],
        remoteWork: true
      },
      responses: questions.slice(0, 5).map((question, index) => ({
        id: question.id,
        answer: index % 2 === 0 ? 'yes' : 'partial'
      }))
    });
    console.log(JSON.stringify({ status: 'ok', sampleOverall: sample.overall.score }, null, 2));
    process.exit(0);
  }

  const server = createServer();
  server.listen(PORT, () => {
    console.log(`ISO 27001 readiness API running on port ${PORT}`);
  });
}

module.exports = createServer;
module.exports.handleAssessment = handleAssessment;
