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

function normaliseEvidence(evidence) {
  if (!evidence) {
    return [];
  }
  if (Array.isArray(evidence)) {
    return evidence
      .map((item) => {
        if (!item) {
          return null;
        }
        if (item.type === 'file') {
          return { type: 'file', id: item.id, name: item.name };
        }
        if (item.type === 'url') {
          return { type: 'url', href: item.href };
        }
        return null;
      })
      .filter(Boolean);
  }
  if (typeof evidence === 'string') {
    return [{ type: 'url', href: evidence }];
  }
  return [];
}

function determineScopeFactor(question, onboarding = {}, excludedControls = new Set()) {
  if (excludedControls.has(question.id)) {
    return 0;
  }

  const defaultScope = question.weight?.defaultScope ?? 1;
  if (!question.scopeRules || question.scopeRules.length === 0) {
    return defaultScope;
  }

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
  return inScope ? defaultScope : 0;
}

function fractionForResponse(question, response) {
  if (!response || response.skipped || response.answer === undefined || response.answer === null || response.answer === '') {
    return null;
  }

  if (response.answer === 'not_applicable') {
    return 1;
  }

  if (question.answerType === 'yes_no_partial') {
    return FRACTION_MAP[response.answer] ?? 0;
  }

  if (question.answerType === 'maturity_1_5') {
    const numericValue = Number(response.answer);
    if (Number.isNaN(numericValue)) {
      return 0;
    }
    if (numericValue === 4 && response.evidenceVerified) {
      return 1;
    }
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
    if (visited.has(item.id) || temp.has(item.id)) {
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

function calculateAssessment(questions, answers = [], onboarding = {}, options = {}) {
  const { excludeUnanswered = true } = options;
  const responses = new Map();
  answers.forEach((item) => {
    if (item && item.id) {
      responses.set(item.id, item);
    }
  });

  const excludedControls = new Set((onboarding.annexAExclusions || []).map((value) => value.trim()).filter(Boolean));

  const items = [];
  const gaps = [];
  const themeAggregates = new Map();

  questions.forEach((question) => {
    const response = responses.get(question.id) || {};
    const scopeFactor = determineScopeFactor(question, onboarding, excludedControls);
    const effectiveWeight = calculateCompositeWeight(question, scopeFactor);
    const inScope = scopeFactor > 0 && effectiveWeight > 0;
    const evidence = normaliseEvidence(response.evidence);
    const fraction = fractionForResponse(question, response);
    const answered = inScope && fraction !== null;
    const contribution = answered ? fraction * effectiveWeight : 0;
    const denominatorWeight = excludeUnanswered ? (answered ? effectiveWeight : 0) : effectiveWeight;
    const notes = response.notes || '';
    const skipped = Boolean(response.skipped) && !answered;

    const item = {
      id: question.id,
      clause: question.clause,
      control: question.control,
      theme: question.theme,
      text: question.text,
      criticality: question.weight.criticality,
      impact: question.weight.impact,
      defaultScope: question.weight.defaultScope ?? 1,
      answer: answered ? response.answer : null,
      answered,
      skipped,
      inScope,
      scopeFactor,
      effectiveWeight: +effectiveWeight.toFixed(2),
      fraction: answered ? +fraction.toFixed(4) : 0,
      weightForDenominator: +denominatorWeight.toFixed(2),
      contribution: +contribution.toFixed(4),
      notes,
      evidence,
      evidenceVerified: Boolean(response.evidenceVerified),
      dependencies: question.dependencies || []
    };

    items.push(item);

    const themeKey = question.theme;
    if (!themeAggregates.has(themeKey)) {
      themeAggregates.set(themeKey, {
        theme: themeKey,
        numerator: 0,
        denominator: 0,
        answered: 0,
        inScope: 0
      });
    }

    const themeStats = themeAggregates.get(themeKey);
    if (inScope) {
      themeStats.inScope += 1;
    }
    if (answered) {
      themeStats.answered += 1;
    }
    themeStats.numerator += contribution;
    themeStats.denominator += denominatorWeight;

    if (inScope) {
      const fractionGap = answered ? 1 - fraction : 1;
      if (fractionGap > 0) {
        const severityScore = +(effectiveWeight * fractionGap).toFixed(2);
        const bandInfo = severityBand(severityScore);
        const effort = scaleEffort(question.effort, fractionGap);
        gaps.push({
          id: question.id,
          title: question.control,
          description: question.text,
          action: question.actionGuidance,
          severityScore,
          band: bandInfo.band,
          severityLabel: bandInfo.label,
          effort,
          dependencies: question.dependencies || [],
          fractionGap: +fractionGap.toFixed(4),
          theme: question.theme,
          notes,
          evidence
        });
      }
    }
  });

  const numerator = items.reduce((sum, item) => sum + item.contribution, 0);
  const denominator = items.reduce((sum, item) => sum + item.weightForDenominator, 0);
  const latest = denominator > 0 ? numerator / denominator : 0;

  const answeredCount = items.filter((item) => item.inScope && item.answered).length;
  const inScopeCount = items.filter((item) => item.inScope).length;

  const themes = Array.from(themeAggregates.values()).map((theme) => ({
    theme: theme.theme,
    latest: theme.denominator > 0 ? theme.numerator / theme.denominator : 0,
    answered: theme.answered,
    inScope: theme.inScope
  }));

  const roadmap = sortRoadmap(
    gaps.map((gap) => ({
      ...gap,
      effort: {
        tech: +gap.effort.tech.toFixed(1),
        people: +gap.effort.people.toFixed(1),
        time: {
          min: +gap.effort.time.min.toFixed(1),
          max: +gap.effort.time.max.toFixed(1)
        }
      }
    }))
  ).map((item) => ({
    ...item,
    effort: {
      tech: +item.effort.tech.toFixed(1),
      people: +item.effort.people.toFixed(1),
      time: {
        min: +item.effort.time.min.toFixed(1),
        max: +item.effort.time.max.toFixed(1)
      }
    }
  }));

  return {
    overall: {
      latest,
      numerator: +numerator.toFixed(4),
      denominator: +denominator.toFixed(4)
    },
    answeredCount,
    inScopeCount,
    themes,
    items,
    gaps,
    roadmap
  };
}

module.exports = {
  calculateAssessment,
  determineScopeFactor,
  fractionForResponse
};
