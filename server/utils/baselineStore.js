const fs = require('fs');
const path = require('path');

const BASELINE_PATH = path.join(__dirname, '..', 'data', 'baseline.json');

function ensureBaselineFile() {
  if (!fs.existsSync(BASELINE_PATH)) {
    const initial = { overall: null, themes: {} };
    fs.writeFileSync(BASELINE_PATH, JSON.stringify(initial, null, 2));
  }
}

function readBaseline() {
  try {
    ensureBaselineFile();
    const raw = fs.readFileSync(BASELINE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      overall: parsed.overall ?? null,
      themes: parsed.themes && typeof parsed.themes === 'object' ? parsed.themes : {}
    };
  } catch (error) {
    return { overall: null, themes: {} };
  }
}

function writeBaseline(baseline) {
  ensureBaselineFile();
  fs.writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2));
}

function resetBaseline() {
  writeBaseline({ overall: null, themes: {} });
}

module.exports = {
  readBaseline,
  writeBaseline,
  resetBaseline
};
