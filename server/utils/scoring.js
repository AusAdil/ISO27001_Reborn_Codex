const FRACTION_MAP = {
  yes: 1,
  partial: 0.5,
  no: 0
};

const MATURITY_MAP = {
  1: 0.2,
  2: 0.4,
  3: 0.65,
  4: 0.85,
  5: 1
};

function determineScopeFactor(question, onboarding) {
  const defaultScope = question.weight?.defaultScope ?? 1;
  if (!question.scopeRules || question.scopeRules.length === 0) {
    return defaultScope;
  }

  let factor = defaultScope;

  const evaluateRule = (rule) => {
    const value = onboarding?.[rule.field];
    switch (rule.operator) {
      case 'equals':
        return value === rule.value;
      case 'notEquals':
        return value !== rule.value;
      case 'includes':
        if (Array.isArray(value)) {
          return value.includes(rule.value);
        }
        if (typeof value === 'string') {
          return value === rule.value;
        }
        if (value && typeof value === 'object') {
          return Boolean(value[rule.value]);
        }
        return false;
      case 'in':
        if (Array.isArray(rule.value)) {
          return rule.value.includes(value);
        }
        return false;
      case 'lengthGreaterThan':
        if (Array.isArray(value)) {
          return value.length > rule.value;
        }
        if (typeof value === 'string') {
          return value.length > rule.value;
        }
        return false;
      case 'intersects':
        if (!Array.isArray(value)) {
          return false;
        }
        return value.some((item) => rule.value.includes(item));
      default:
        return true;
    }
  };

  const inScope = question.scopeRules.every(evaluateRule);
  return inScope ? factor : 0;
}

function fractionForAnswer(question, answerValue) {
  if (answerValue === null || answerValue === undefined) {
    return 0;
  }
  if (answerValue === 'not_applicable') {
    return 1;
  }
  if (question.answerType === 'yes_no_partial') {
    return FRACTION_MAP[answerValue] ?? 0;
  }
  if (question.answerType === 'maturity_1_5') {
    const numericValue = Number(answerValue);
    return MATURITY_MAP[numericValue] ?? 0;
  }
  return 0;
}

function calculateCompositeWeight(question, scopeFactor) {
  const { criticality, impact } = question.weight;
  return scopeFactor * criticality * impact;
}

function scaleEffort(base, fractionGap) {
  const scaledTech = +(base.tech * fractionGap).toFixed(1);
  const scaledPeople = +(base.people * fractionGap).toFixed(1);
  const scaledTime = {
    min: Math.max(0.5, +(base.time.min * fractionGap).toFixed(1)),
    max: Math.max(0.5, +(base.time.max * fractionGap).toFixed(1))
  };
  return {
    tech: scaledTech,
    people: scaledPeople,
    time: scaledTime
  };
}

function severityBand(score) {
  if (score >= 6) {
    return { band: 'Quick Win', label: 'Critical' };
  }
  if (score >= 3) {
    return { band: 'Quick Win', label: 'High' };
  }
  if (score >= 1.5) {
    return { band: 'Medium', label: 'Medium' };
  }
  return { band: 'Long-term', label: 'Low' };
}

function topoSortRoadmap(items) {
  const map = new Map();
  items.forEach((item) => map.set(item.id, item));
  const visited = new Set();
  const temp = new Set();
  const result = [];

  function visit(item) {
    if (visited.has(item.id)) {
      return;
    }
    if (temp.has(item.id)) {
      return;
    }
    temp.add(item.id);
    (item.dependencies || []).forEach((depId) => {
      const dep = map.get(depId);
      if (dep) {
        visit(dep);
      }
    });
    temp.delete(item.id);
    visited.add(item.id);
    result.push(item);
  }

  items.forEach(visit);
  return result;
}

function sortRoadmap(gaps) {
  const bandOrder = ['Quick Win', 'Medium', 'Long-term'];
  const grouped = bandOrder.map((band) => ({ band, items: [] }));
  const indexByBand = Object.fromEntries(bandOrder.map((band, index) => [band, index]));

  gaps.forEach((gap) => {
    const idx = indexByBand[gap.band];
    if (idx !== undefined) {
      grouped[idx].items.push(gap);
    }
  });

  const prioritised = [];
  grouped.forEach(({ items }) => {
    items.sort((a, b) => {
      if (b.severityScore !== a.severityScore) {
        return b.severityScore - a.severityScore;
      }
      return a.effort.time.min - b.effort.time.min;
    });
    const ordered = topoSortRoadmap(items);
    prioritised.push(...ordered);
  });

  return prioritised;
}

function calculateScores(questions, responses, onboarding) {
  let totalWeightedScore = 0;
  let totalWeight = 0;
  const themeTotals = new Map();
  const themeWeights = new Map();
  const breakdown = [];
  const gaps = [];

  questions.forEach((question) => {
    const response = responses.find((item) => item.id === question.id) || {};
    const fraction = fractionForAnswer(question, response.answer);
    const scopeFactor = determineScopeFactor(question, onboarding);
    const weight = calculateCompositeWeight(question, scopeFactor);

    if (weight === 0) {
      breakdown.push({
        id: question.id,
        text: question.text,
        clause: question.clause,
        control: question.control,
        theme: question.theme,
        fraction,
        weight,
        scopeFactor,
        contribution: 0,
        notes: response.notes || '',
        evidence: response.evidence || ''
      });
      return;
    }

    const weightedScore = fraction * weight;
    totalWeightedScore += weightedScore;
    totalWeight += weight;

    const currentThemeScore = themeTotals.get(question.theme) || 0;
    themeTotals.set(question.theme, currentThemeScore + weightedScore);
    const currentThemeWeight = themeWeights.get(question.theme) || 0;
    themeWeights.set(question.theme, currentThemeWeight + weight);

    const fractionGap = 1 - fraction;
    const severityScore = +(weight * fractionGap).toFixed(2);
    const bandInfo = severityBand(severityScore);

    const entry = {
      id: question.id,
      text: question.text,
      clause: question.clause,
      control: question.control,
      theme: question.theme,
      fraction,
      weight,
      scopeFactor,
      contribution: weightedScore,
      notes: response.notes || '',
      evidence: response.evidence || ''
    };
    breakdown.push(entry);

    if (fractionGap > 0) {
      const effort = scaleEffort(question.effort, fractionGap);
      const gap = {
        id: question.id,
        title: question.control,
        description: question.text,
        action: question.actionGuidance,
        severityScore,
        band: bandInfo.band,
        severityLabel: bandInfo.label,
        effort,
        dependencies: question.dependencies || [],
        fractionGap,
        theme: question.theme
      };
      gaps.push(gap);
    }
  });

  const overallScore = totalWeight ? +(100 * (totalWeightedScore / totalWeight)).toFixed(1) : 0;

  const themeScores = Array.from(themeTotals.entries()).map(([theme, score]) => {
    const weight = themeWeights.get(theme) || 1;
    return {
      theme,
      score: +(100 * (score / weight)).toFixed(1)
    };
  });

  const gapDetails = gaps
    .filter((gap) => gap.fractionGap > 0)
    .map((gap) => ({
      ...gap,
      effort: {
        tech: gap.effort.tech,
        people: gap.effort.people,
        time: {
          min: gap.effort.time.min,
          max: gap.effort.time.max
        }
      }
    }));

  const prioritisedRoadmap = sortRoadmap(gapDetails);

  return {
    overallScore,
    totalWeight: +totalWeight.toFixed(2),
    themeScores,
    breakdown,
    gaps: gapDetails,
    roadmap: prioritisedRoadmap
  };
}

module.exports = {
  calculateScores,
  determineScopeFactor,
  fractionForAnswer
};
