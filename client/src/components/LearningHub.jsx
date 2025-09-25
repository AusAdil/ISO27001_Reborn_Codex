import React, { useMemo } from 'react';

const LearningHub = ({ learning, onBack }) => {
  const entries = useMemo(
    () =>
      Object.entries(learning).sort(([a], [b]) =>
        a.localeCompare(b, undefined, {
          numeric: true,
          sensitivity: 'base'
        })
      ),
    [learning]
  );

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Learning hub</h2>
          <p style={{ margin: 0, color: '#486581' }}>
            Plain-English guidance explaining what each clause or control means, why it matters and how to uplift maturity.
          </p>
        </div>
        <button type="button" className="secondary" onClick={onBack}>
          Back to results
        </button>
      </div>
      <div className="learning-grid" style={{ marginTop: 24 }}>
        {entries.map(([control, content]) => (
          <div key={control} className="learning-card">
            <strong style={{ color: '#102a43' }}>{control}</strong>
            <p style={{ margin: '12px 0 6px', color: '#1f3c6d' }}>What</p>
            <p style={{ margin: '0 0 8px', color: '#486581' }}>{content.what}</p>
            <p style={{ margin: '12px 0 6px', color: '#1f3c6d' }}>Why</p>
            <p style={{ margin: '0 0 8px', color: '#486581' }}>{content.why}</p>
            <p style={{ margin: '12px 0 6px', color: '#1f3c6d' }}>How</p>
            <p style={{ margin: 0, color: '#486581' }}>{content.how}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningHub;
