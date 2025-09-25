import React from 'react';
import { jsPDF } from 'jspdf';

const formatPercentage = (value) => {
  if (value === null || value === undefined) {
    return '—';
  }
  return `${(Number(value) * 100).toFixed(1)}%`;
};

const formatEffort = (effort) =>
  `${effort.tech.toFixed(1)} tech · ${effort.people.toFixed(1)} people · ${effort.time.min.toFixed(1)}-${effort.time.max.toFixed(1)} weeks`;

const summariseEvidence = (evidence = []) => {
  if (!evidence.length) {
    return '';
  }
  const counts = evidence.reduce(
    (acc, item) => {
      if (item.type === 'file') {
        acc.files += 1;
      } else {
        acc.links += 1;
      }
      return acc;
    },
    { files: 0, links: 0 }
  );
  const parts = [];
  if (counts.files) {
    parts.push(`${counts.files} file${counts.files > 1 ? 's' : ''}`);
  }
  if (counts.links) {
    parts.push(`${counts.links} link${counts.links > 1 ? 's' : ''}`);
  }
  return `Evidence: ${parts.join(', ')}`;
};

const exportToPdf = (result) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 48;
  let y = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ISO 27001 readiness summary', margin, y);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  y += 24;
  doc.text(`Generated: ${new Date(result.timestamp || Date.now()).toLocaleString()}`, margin, y);

  y += 28;
  doc.setFont('helvetica', 'bold');
  doc.text('Scores', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 20;
  doc.text(`Overall score: ${formatPercentage(result.overall.latest)}`, margin, y);
  y += 16;
  doc.text(
    `Baseline comparison: ${formatPercentage(result.overall.baseline)} → ${formatPercentage(result.overall.latest)}`,
    margin,
    y
  );
  y += 16;
  doc.text(
    `Controls answered: ${result.answeredCount} of ${result.inScopeCount} (weighted by answered controls only)`,
    margin,
    y
  );

  y += 24;
  doc.setFont('helvetica', 'bold');
  doc.text('Theme scores', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 20;
  result.themes.slice(0, 9).forEach((theme) => {
    const completeness = theme.answered === 0 ? 'Incomplete' : `${theme.answered}/${theme.inScope} answered`;
    doc.text(`${theme.theme}: ${formatPercentage(theme.latest)} (${completeness})`, margin, y);
    y += 16;
  });

  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Top gaps', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 20;
  result.gaps.slice(0, 10).forEach((gap, index) => {
    const evidenceSummary = summariseEvidence(gap.evidence);
    doc.text(
      `${index + 1}. ${gap.title} (${gap.severityLabel}) – gap ${(gap.fractionGap * 100).toFixed(0)}%`,
      margin,
      y
    );
    y += 16;
    doc.text(`   Effort: ${formatEffort(gap.effort)}`, margin, y);
    y += 16;
    if (gap.notes) {
      doc.text(`   Notes: ${gap.notes}`, margin, y, { maxWidth: 520 });
      y += 16;
    }
    if (evidenceSummary) {
      doc.text(`   ${evidenceSummary}`, margin, y);
      y += 16;
    }
  });

  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Next actions', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 20;
  result.roadmap.slice(0, 10).forEach((item, index) => {
    const evidenceSummary = summariseEvidence(item.evidence);
    doc.text(`${index + 1}. ${item.title} – ${item.band} (${formatEffort(item.effort)})`, margin, y);
    y += 16;
    if (item.notes) {
      doc.text(`   Notes: ${item.notes}`, margin, y, { maxWidth: 520 });
      y += 16;
    }
    if (evidenceSummary) {
      doc.text(`   ${evidenceSummary}`, margin, y);
      y += 16;
    }
  });

  doc.save('iso27001-readiness-summary.pdf');
};

const ScoreCard = ({ result, onResetBaseline }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div>
      <h2>Overall readiness</h2>
      <p style={{ marginTop: 0, color: '#486581' }}>
        Weighted by scope × criticality × impact; based on answered controls only.
      </p>
    </div>
    <div className="score-display">{formatPercentage(result.overall.latest)}</div>
    <div className="chip-row">
      <div className="chip">Baseline {formatPercentage(result.overall.baseline)}</div>
      <div className="chip">Latest {formatPercentage(result.overall.latest)}</div>
      <div className="chip">Controls answered {result.answeredCount} of {result.inScopeCount}</div>
    </div>
    <div className="chip-row">
      <button type="button" className="secondary" onClick={onResetBaseline}>
        Reset baseline
      </button>
      <small style={{ color: '#627d98' }}>
        Baseline is captured after the first completed assessment and remains fixed until you reset it.
      </small>
    </div>
  </div>
);

const ThemeSummary = ({ themes }) => (
  <div className="card">
    <h2>Theme performance</h2>
    <div className="score-grid">
      {themes.map((theme) => (
        <div key={theme.theme} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <strong style={{ color: '#0b3d91' }}>{theme.theme}</strong>
          <span style={{ color: '#102a43' }}>{formatPercentage(theme.latest)}</span>
          <small style={{ color: theme.answered === 0 ? '#9f1830' : '#627d98' }}>
            {theme.answered === 0 ? 'Incomplete' : `${theme.answered}/${theme.inScope} answered`}
          </small>
          {theme.baseline !== null && (
            <small style={{ color: '#627d98' }}>Baseline {formatPercentage(theme.baseline)}</small>
          )}
        </div>
      ))}
    </div>
  </div>
);

const GapList = ({ gaps }) => (
  <div className="card">
    <h2>Key gaps</h2>
    <div className="gap-grid">
      {gaps.slice(0, 6).map((gap) => (
        <div key={gap.id} style={{ borderBottom: '1px solid rgba(15, 58, 98, 0.1)', paddingBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <strong style={{ color: '#102a43' }}>{gap.title}</strong>
            <span className="chip">{gap.band}</span>
          </div>
          <p style={{ margin: '8px 0', color: '#486581' }}>{gap.description}</p>
          <p style={{ margin: '0 0 8px', color: '#627d98' }}>{gap.action}</p>
          <small style={{ color: '#627d98' }}>Effort {formatEffort(gap.effort)}</small>
          {gap.notes && <small style={{ display: 'block', color: '#486581', marginTop: 4 }}>Notes: {gap.notes}</small>}
          {gap.evidence?.length ? (
            <small style={{ display: 'block', color: '#486581', marginTop: 4 }}>{summariseEvidence(gap.evidence)}</small>
          ) : null}
        </div>
      ))}
    </div>
  </div>
);

const Roadmap = ({ roadmap }) => (
  <div className="card">
    <h2>Prioritised roadmap</h2>
    <div className="gap-grid">
      {roadmap.slice(0, 12).map((item) => (
        <div key={item.id} style={{ borderBottom: '1px solid rgba(15, 58, 98, 0.1)', paddingBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <strong style={{ color: '#102a43' }}>{item.title}</strong>
            <span className="chip">{item.band}</span>
          </div>
          <p style={{ margin: '8px 0', color: '#486581' }}>{item.action}</p>
          <small style={{ color: '#627d98' }}>Effort {formatEffort(item.effort)}</small>
          {item.dependencies?.length ? (
            <small style={{ color: '#627d98' }}>Dependencies: {item.dependencies.join(', ')}</small>
          ) : null}
          {item.notes && <small style={{ display: 'block', color: '#486581', marginTop: 4 }}>Notes: {item.notes}</small>}
          {item.evidence?.length ? (
            <small style={{ display: 'block', color: '#486581', marginTop: 4 }}>{summariseEvidence(item.evidence)}</small>
          ) : null}
        </div>
      ))}
    </div>
  </div>
);

const WeightingSummary = ({ items }) => (
  <div className="card">
    <h2>Weighting model</h2>
    <p style={{ marginTop: 0, color: '#486581' }}>
      Scope factors reflect your onboarding selections. Out-of-scope controls are excluded from the denominator until you bring
      them back into scope.
    </p>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#1f3c6d' }}>
            <th style={{ padding: '8px 0' }}>Control</th>
            <th style={{ padding: '8px 0' }}>Clause</th>
            <th style={{ padding: '8px 0' }}>Theme</th>
            <th style={{ padding: '8px 0' }}>Criticality</th>
            <th style={{ padding: '8px 0' }}>Impact</th>
            <th style={{ padding: '8px 0' }}>Scope factor</th>
            <th style={{ padding: '8px 0' }}>Effective weight</th>
            <th style={{ padding: '8px 0' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.slice(0, 12).map((item) => (
            <tr key={item.id} style={{ borderTop: '1px solid rgba(15, 58, 98, 0.08)' }}>
              <td style={{ padding: '8px 0', color: '#102a43' }}>{item.control}</td>
              <td style={{ padding: '8px 0', color: '#627d98' }}>{item.clause}</td>
              <td style={{ padding: '8px 0', color: '#627d98' }}>{item.theme}</td>
              <td style={{ padding: '8px 0' }}>{item.criticality.toFixed(2)}</td>
              <td style={{ padding: '8px 0' }}>{item.impact.toFixed(2)}</td>
              <td style={{ padding: '8px 0' }}>{item.scopeFactor.toFixed(2)}</td>
              <td style={{ padding: '8px 0' }}>{item.effectiveWeight.toFixed(2)}</td>
              <td style={{ padding: '8px 0', color: item.inScope ? '#0b3d91' : '#9f1830' }}>
                {item.inScope ? (item.answered ? 'Answered' : 'Awaiting answer') : 'Out of scope'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <small style={{ color: '#627d98' }}>The PDF export includes the top gaps, actions, notes and evidence indicators.</small>
  </div>
);

const ResultsDashboard = ({ result, onRestart, onViewLearning, onResetBaseline }) => (
  <div className="grid" style={{ gap: '24px' }}>
    <ScoreCard result={result} onResetBaseline={onResetBaseline} />
    <ThemeSummary themes={result.themes} />
    <GapList gaps={result.gaps} />
    <Roadmap roadmap={result.roadmap} />
    <WeightingSummary items={result.items} />
    <div className="card" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <button type="button" onClick={() => exportToPdf(result)}>Export one-page PDF</button>
      <button type="button" className="secondary" onClick={onRestart}>
        Start new assessment
      </button>
      <button type="button" className="secondary" onClick={onViewLearning}>
        Open learning hub
      </button>
    </div>
  </div>
);

export default ResultsDashboard;
