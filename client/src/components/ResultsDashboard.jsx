import React from 'react';
import { jsPDF } from 'jspdf';

const formatPercentage = (value) => `${Number(value).toFixed(1)}%`;

const formatEffort = (effort) =>
  `${effort.tech.toFixed(1)} tech · ${effort.people.toFixed(1)} people · ${effort.time.min.toFixed(1)}-${effort.time.max.toFixed(1)} weeks`;

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
  doc.text(`Overall score: ${formatPercentage(result.overall.score)}`, margin, y);
  y += 16;
  doc.text(`Baseline comparison: ${formatPercentage(result.overall.baseline)} → ${formatPercentage(result.overall.latest)}`, margin, y);

  y += 24;
  doc.setFont('helvetica', 'bold');
  doc.text('Theme scores', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 20;
  result.themes.slice(0, 9).forEach((theme) => {
    doc.text(`${theme.theme}: ${formatPercentage(theme.latest)}`, margin, y);
    y += 16;
  });

  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Top gaps', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 20;
  result.gaps.slice(0, 10).forEach((gap, index) => {
    const text = `${index + 1}. ${gap.title} (${gap.severityLabel}) – gap ${(gap.fractionGap * 100).toFixed(0)}%`;
    doc.text(text, margin, y);
    y += 16;
    doc.text(`   Effort: ${formatEffort(gap.effort)}`, margin, y);
    y += 16;
  });

  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Next actions', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 20;
  result.roadmap.slice(0, 10).forEach((item, index) => {
    const text = `${index + 1}. ${item.title} – ${item.band} (${formatEffort(item.effort)})`;
    doc.text(text, margin, y);
    y += 16;
  });

  doc.save('iso27001-readiness-summary.pdf');
};

const ScoreCard = ({ result }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div>
      <h2>Overall readiness</h2>
      <p style={{ margin: 0, color: '#486581' }}>Weighted by scope × criticality × impact</p>
    </div>
    <div className="score-display">{formatPercentage(result.overall.score)}</div>
    <div className="chip-row">
      <div className="chip">Baseline {formatPercentage(result.overall.baseline)}</div>
      <div className="chip">Latest {formatPercentage(result.overall.latest)}</div>
      <div className="chip">Controls answered {result.breakdown.length}</div>
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
          <small style={{ color: '#627d98' }}>Baseline {formatPercentage(theme.baseline)}</small>
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
        </div>
      ))}
    </div>
  </div>
);

const WeightingSummary = ({ weightings }) => (
  <div className="card">
    <h2>Weighting model</h2>
    <p style={{ marginTop: 0, color: '#486581' }}>
      Scope × criticality × impact determines the influence of each control on your score. Out-of-scope items are omitted.
    </p>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#1f3c6d' }}>
            <th style={{ padding: '8px 0' }}>Control</th>
            <th style={{ padding: '8px 0' }}>Theme</th>
            <th style={{ padding: '8px 0' }}>Criticality</th>
            <th style={{ padding: '8px 0' }}>Impact</th>
            <th style={{ padding: '8px 0' }}>Default scope</th>
          </tr>
        </thead>
        <tbody>
          {weightings.slice(0, 12).map((item) => (
            <tr key={item.id} style={{ borderTop: '1px solid rgba(15, 58, 98, 0.08)' }}>
              <td style={{ padding: '8px 0', color: '#102a43' }}>{item.control}</td>
              <td style={{ padding: '8px 0', color: '#627d98' }}>{item.theme}</td>
              <td style={{ padding: '8px 0' }}>{item.criticality}</td>
              <td style={{ padding: '8px 0' }}>{item.impact}</td>
              <td style={{ padding: '8px 0' }}>{item.defaultScope}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <small style={{ color: '#627d98' }}>Full weighting export is included within the PDF report.</small>
  </div>
);

const ResultsDashboard = ({ result, onRestart, onViewLearning }) => (
  <div className="grid" style={{ gap: '24px' }}>
    <ScoreCard result={result} />
    <ThemeSummary themes={result.themes} />
    <GapList gaps={result.gaps} />
    <Roadmap roadmap={result.roadmap} />
    <WeightingSummary weightings={result.weightings} />
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
