import React, { useMemo, useState } from 'react';

const formatOptionValue = (value) => (typeof value === 'number' ? String(value) : value);

const AssessmentFlow = ({ questions, responses, onUpdate, onSubmit, onBack }) => {
  const [index, setIndex] = useState(0);
  const total = questions.length;

  const answeredCount = useMemo(
    () => Object.values(responses).filter((response) => response && response.answer !== undefined && response.answer !== '').length,
    [responses]
  );

  const progress = Math.round((answeredCount / total) * 100);

  const currentQuestion = questions[index];
  const currentResponse = responses[currentQuestion.id] || {};

  const handleOptionSelect = (value) => {
    onUpdate(currentQuestion.id, {
      answer: formatOptionValue(value)
    });
  };

  const handleNotesChange = (value) => {
    onUpdate(currentQuestion.id, {
      notes: value
    });
  };

  const handleEvidenceChange = (value) => {
    onUpdate(currentQuestion.id, {
      evidence: value
    });
  };

  const goTo = (offset) => {
    setIndex((prev) => {
      const next = prev + offset;
      if (next < 0) {
        return 0;
      }
      if (next >= total) {
        return total - 1;
      }
      return next;
    });
  };

  const isLastQuestion = index === total - 1;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Assessment</h2>
          <p style={{ margin: 0, color: '#486581' }}>
            {currentQuestion.clause} · {currentQuestion.control}
          </p>
        </div>
        <div className="score-badge" aria-live="polite">
          Question {index + 1} of {total}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="progress-bar" aria-hidden="true">
          <span style={{ width: `${Math.max(progress, 4)}%` }}></span>
        </div>
        <p style={{ margin: '12px 0 0', color: '#486581' }}>
          {progress}% of questions answered. Theme: <strong>{currentQuestion.theme}</strong>
        </p>
      </div>

      <div className="question-wrapper" style={{ marginTop: 24 }}>
        <div>
          <p style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 12px', color: '#102a43' }}>{currentQuestion.text}</p>
          <p style={{ margin: 0, color: '#627d98' }}>
            Criticality {currentQuestion.weight.criticality} × Impact {currentQuestion.weight.impact}
            {currentQuestion.weight.defaultScope < 1 ? ` · Default scope ${currentQuestion.weight.defaultScope}` : ''}
          </p>
        </div>
        <div className="option-list">
          {currentQuestion.options.map((option) => {
            const optionValue = formatOptionValue(option.value);
            const selected = currentResponse.answer === optionValue;
            return (
              <button
                key={optionValue}
                type="button"
                className={`option ${selected ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(optionValue)}
                aria-pressed={selected}
              >
                <span style={{ fontWeight: 600 }}>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid" style={{ gap: '16px', marginTop: 24 }}>
        <div>
          <label htmlFor={`notes-${currentQuestion.id}`}>Notes (optional)</label>
          <textarea
            id={`notes-${currentQuestion.id}`}
            value={currentResponse.notes || ''}
            onChange={(event) => handleNotesChange(event.target.value)}
            placeholder="Add context, owners or known blockers."
          />
        </div>
        <div>
          <label htmlFor={`evidence-${currentQuestion.id}`}>Evidence link (optional)</label>
          <input
            id={`evidence-${currentQuestion.id}`}
            type="url"
            value={currentResponse.evidence || ''}
            onChange={(event) => handleEvidenceChange(event.target.value)}
            placeholder="https://…"
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
        <div className="chip-row">
          {(currentQuestion.dependencies || []).length > 0 && (
            <div className="chip" aria-label="Dependencies">
              Depends on: {currentQuestion.dependencies.join(', ')}
            </div>
          )}
          <div className="chip" aria-label="Clause and theme">
            {currentQuestion.clause} · {currentQuestion.theme}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" className="secondary" onClick={onBack}>
            Adjust scope
          </button>
          <button type="button" className="secondary" onClick={() => goTo(-1)} disabled={index === 0}>
            Previous
          </button>
          {!isLastQuestion && (
            <button type="button" onClick={() => goTo(1)}>
              Next
            </button>
          )}
          {isLastQuestion && (
            <button type="button" onClick={onSubmit} disabled={answeredCount === 0}>
              Generate readiness report
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentFlow;
