import React, { useMemo, useState } from 'react';

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return Boolean(url.protocol && url.host);
  } catch (error) {
    return false;
  }
};

const QuestionCard = ({
  question,
  meta,
  response,
  onSelectOption,
  onNotesChange,
  onAddEvidenceUrl,
  onUploadEvidenceFile,
  onRemoveEvidence,
  onToggleEvidenceVerified,
  validationError,
  resolveEvidenceUrl = (item) => `/api/uploads/${item.id}`
}) => {
  const [urlDraft, setUrlDraft] = useState('');
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState('');

  const weightSummary = useMemo(() => {
    const scope = meta ? meta.scopeFactor ?? question.weight.defaultScope ?? 1 : question.weight.defaultScope ?? 1;
    const criticality = question.weight.criticality;
    const impact = question.weight.impact;
    const effective = meta && typeof meta.effectiveWeight === 'number' ? meta.effectiveWeight : scope * criticality * impact;
    return {
      scope: Number(scope).toFixed(2),
      criticality: Number(criticality).toFixed(2),
      impact: Number(impact).toFixed(2),
      effective: Number(effective).toFixed(2)
    };
  }, [meta, question.weight]);

  const handleAddUrl = () => {
    if (!urlDraft.trim()) {
      return;
    }
    if (!isValidUrl(urlDraft.trim())) {
      setLocalError('Enter a valid evidence URL.');
      return;
    }
    onAddEvidenceUrl(urlDraft.trim());
    setUrlDraft('');
    setLocalError('');
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setUploading(true);
    setLocalError('');
    try {
      await onUploadEvidenceFile(file);
    } catch (error) {
      setLocalError('We could not upload that file. Please try again.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const evidenceItems = response.evidence || [];

  return (
    <div className="question-card">
      <div className="question-header">
        <div>
          <p className="question-title">{question.text}</p>
          <p className="question-meta">
            {question.clause} · {question.control}
          </p>
          <p className="question-meta">
            Weight: Scope {weightSummary.scope} × Criticality {weightSummary.criticality} × Impact {weightSummary.impact} ={' '}
            <strong>{weightSummary.effective}</strong>
            {meta && meta.inScope === false ? ' · Out of scope' : ''}
          </p>
        </div>
      </div>

      <div className="option-list" role="radiogroup" aria-label={`Answer options for ${question.control}`}>
        {question.options.map((option) => {
          const value = String(option.value);
          const selected = response.answer === value;
          const isDisabled = meta && meta.inScope === false;
          return (
            <button
              key={value}
              type="button"
              className={`option ${selected ? 'selected' : ''}`}
              onClick={() => !isDisabled && onSelectOption(value)}
              aria-pressed={selected}
              disabled={isDisabled}
            >
              <span className="option-label">{option.label}</span>
            </button>
          );
        })}
      </div>

      <div className="question-notes">
        <label htmlFor={`notes-${question.id}`}>Notes (optional)</label>
        <textarea
          id={`notes-${question.id}`}
          value={response.notes || ''}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="Add context, owners or known blockers."
        />
      </div>

      <div className="question-evidence">
        <div className="evidence-actions">
          <div className="evidence-input">
            <label htmlFor={`evidence-url-${question.id}`}>Evidence URL</label>
            <div className="evidence-url-row">
              <input
                id={`evidence-url-${question.id}`}
                type="url"
                placeholder="https://…"
                value={urlDraft}
                onChange={(event) => setUrlDraft(event.target.value)}
              />
              <button type="button" className="secondary" onClick={handleAddUrl}>
                Add link
              </button>
            </div>
          </div>
          <div className="evidence-input">
            <label htmlFor={`evidence-file-${question.id}`}>Upload supporting file</label>
            <input id={`evidence-file-${question.id}`} type="file" onChange={handleUpload} disabled={uploading} />
          </div>
        </div>
        {localError && <small className="error-text">{localError}</small>}
        <div className="evidence-list" role="list">
          {evidenceItems.map((item, index) => (
            <div key={`${item.type}-${index}`} className="chip evidence-chip" role="listitem">
              {item.type === 'file' ? (
                <a href={resolveEvidenceUrl(item)} target="_blank" rel="noreferrer">
                  {item.name}
                </a>
              ) : (
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.href}
                </a>
              )}
              <button type="button" aria-label="Remove evidence" onClick={() => onRemoveEvidence(index)}>
                ×
              </button>
            </div>
          ))}
          {evidenceItems.length === 0 && <span className="helper-text">No evidence added yet.</span>}
        </div>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={Boolean(response.evidenceVerified)}
            onChange={(event) => onToggleEvidenceVerified(event.target.checked)}
          />
          Evidence verified (treat a maturity level of 4 as fully embedded)
        </label>
      </div>

      {validationError && <div className="inline-warning">{validationError}</div>}
    </div>
  );
};

export default QuestionCard;
