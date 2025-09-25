import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import QuestionCard from './QuestionCard.jsx';

const formatOptionValue = (value) => (typeof value === 'number' ? String(value) : value);

const AssessmentFlow = ({
  questions,
  previewItems,
  responses,
  onUpdate,
  onSubmit,
  onAdjustScope,
  buildUrl
}) => {
  const [index, setIndex] = useState(0);
  const [validationError, setValidationError] = useState('');

  const metaMap = useMemo(() => new Map((previewItems || []).map((item) => [item.id, item])), [previewItems]);

  const inScopeQuestions = useMemo(() => {
    if (!questions || questions.length === 0) {
      return [];
    }
    if (!previewItems) {
      return questions;
    }
    return questions.filter((question) => {
      const meta = metaMap.get(question.id);
      return !meta || meta.inScope !== false;
    });
  }, [questions, metaMap, previewItems]);

  useEffect(() => {
    if (index >= inScopeQuestions.length) {
      setIndex(inScopeQuestions.length > 0 ? inScopeQuestions.length - 1 : 0);
    }
  }, [index, inScopeQuestions.length]);

  const currentQuestion = inScopeQuestions[index];
  const currentMeta = currentQuestion ? metaMap.get(currentQuestion.id) : null;
  const currentResponse = currentQuestion ? responses[currentQuestion.id] || { evidence: [] } : { evidence: [] };

  const isAnswered = (response) =>
    response && response.answer !== undefined && response.answer !== null && response.answer !== '' && !response.skipped;

  const answeredCount = useMemo(
    () =>
      inScopeQuestions.reduce((total, question) => {
        const response = responses[question.id];
        return total + (isAnswered(response) ? 1 : 0);
      }, 0),
    [inScopeQuestions, responses]
  );

  const completionRatio = inScopeQuestions.length > 0 ? answeredCount / inScopeQuestions.length : 0;
  const progress = Math.round(completionRatio * 100);
  const questionComplete = currentResponse.skipped || isAnswered(currentResponse);

  const ensureResponseInitialised = (questionId) => {
    if (!responses[questionId]) {
      onUpdate(questionId, { evidence: [] });
    }
  };

  const handleSelectOption = (value) => {
    ensureResponseInitialised(currentQuestion.id);
    onUpdate(currentQuestion.id, { answer: formatOptionValue(value), skipped: false });
    setValidationError('');
  };

  const handleNotesChange = (value) => {
    ensureResponseInitialised(currentQuestion.id);
    onUpdate(currentQuestion.id, { notes: value });
  };

  const handleAddEvidenceUrl = (url) => {
    ensureResponseInitialised(currentQuestion.id);
    const existing = currentResponse.evidence || [];
    const nextEvidence = [...existing, { type: 'url', href: url }];
    onUpdate(currentQuestion.id, { evidence: nextEvidence });
  };

  const handleUploadEvidenceFile = async (file) => {
    ensureResponseInitialised(currentQuestion.id);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await axios.post(buildUrl('/api/uploads'), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const existing = currentResponse.evidence || [];
      const nextEvidence = [...existing, { type: 'file', id: data.fileId, name: data.filename }];
      onUpdate(currentQuestion.id, { evidence: nextEvidence });
    } catch (error) {
      throw error;
    }
  };

  const handleRemoveEvidence = (indexToRemove) => {
    ensureResponseInitialised(currentQuestion.id);
    const existing = currentResponse.evidence || [];
    const nextEvidence = existing.filter((_, index) => index !== indexToRemove);
    onUpdate(currentQuestion.id, { evidence: nextEvidence });
  };

  const handleToggleEvidenceVerified = (value) => {
    ensureResponseInitialised(currentQuestion.id);
    onUpdate(currentQuestion.id, { evidenceVerified: value });
  };

  const handleSkip = () => {
    ensureResponseInitialised(currentQuestion.id);
    onUpdate(currentQuestion.id, { skipped: true, answer: null });
    setValidationError('');
  };

  const handleUndoSkip = () => {
    ensureResponseInitialised(currentQuestion.id);
    onUpdate(currentQuestion.id, { skipped: false });
    setValidationError('');
  };

  const goTo = (offset) => {
    if (offset > 0 && !questionComplete) {
      setValidationError('Select an answer or use Skip before continuing.');
      return;
    }
    setValidationError('');
    setIndex((prev) => {
      const next = prev + offset;
      if (next < 0) {
        return 0;
      }
      if (next >= inScopeQuestions.length) {
        return inScopeQuestions.length - 1;
      }
      return next;
    });
  };

  const handleFinish = () => {
    if (!questionComplete) {
      setValidationError('Select an answer or use Skip before finishing.');
      return;
    }
    if (completionRatio < 0.8) {
      const confirmFinish = window.confirm(
        'You have answered fewer than 80% of in-scope controls. This will limit the accuracy of insights. Continue?'
      );
      if (!confirmFinish) {
        return;
      }
    }
    onSubmit(completionRatio);
  };

  if (inScopeQuestions.length === 0) {
    return (
      <div className="card">
        <h2>All controls excluded</h2>
        <p style={{ color: '#486581' }}>
          Your current onboarding excludes every control. Adjust the scope to bring some controls back into view.
        </p>
        <button type="button" onClick={onAdjustScope}>
          Adjust scope
        </button>
      </div>
    );
  }

  const isLastQuestion = index === inScopeQuestions.length - 1;

  return (
    <div className="card assessment-flow">
      <div className="assessment-header">
        <div>
          <h2 style={{ marginBottom: 4 }}>Assessment</h2>
          <p style={{ margin: 0, color: '#486581' }}>Question {index + 1} of {inScopeQuestions.length}</p>
          {currentQuestion && (
            <p style={{ margin: '4px 0 0', color: '#486581' }}>
              <strong>Theme:</strong> {currentQuestion.theme}
            </p>
          )}
        </div>
        <div className="score-badge" aria-live="polite">
          {answeredCount} of {inScopeQuestions.length} controls answered
        </div>
      </div>

      <div className="progress-area">
        <div className="progress-bar" aria-hidden="true">
          <span style={{ width: `${Math.max(progress, 4)}%` }}></span>
        </div>
        <p style={{ margin: '12px 0 0', color: '#486581' }}>{progress}% of in-scope controls answered.</p>
      </div>

      <QuestionCard
        question={currentQuestion}
        meta={currentMeta}
        response={currentResponse}
        onSelectOption={handleSelectOption}
        onNotesChange={handleNotesChange}
        onAddEvidenceUrl={handleAddEvidenceUrl}
        onUploadEvidenceFile={handleUploadEvidenceFile}
        onRemoveEvidence={handleRemoveEvidence}
        onToggleEvidenceVerified={handleToggleEvidenceVerified}
        validationError={validationError}
        resolveEvidenceUrl={(item) => buildUrl(`/api/uploads/${item.id}`)}
      />

      <div className="assessment-actions">
        <div className="chip-row">
          <button type="button" className="secondary" onClick={onAdjustScope}>
            Adjust scope
          </button>
          {currentResponse.skipped ? (
            <span className="chip warning">Skipped</span>
          ) : (
            <span className="chip">
              {currentMeta && typeof currentMeta.effectiveWeight === 'number'
                ? `Weight ${currentMeta.effectiveWeight.toFixed(2)}`
                : 'Default weight'}
            </span>
          )}
        </div>
        <div className="action-buttons">
          {currentResponse.skipped ? (
            <button type="button" className="secondary" onClick={handleUndoSkip}>
              Undo skip
            </button>
          ) : (
            <button type="button" className="secondary" onClick={handleSkip}>
              Skip
            </button>
          )}
          <button type="button" className="secondary" onClick={() => goTo(-1)} disabled={index === 0}>
            Previous
          </button>
          {!isLastQuestion && (
            <button type="button" onClick={() => goTo(1)}>
              Next
            </button>
          )}
          {isLastQuestion && (
            <button type="button" onClick={handleFinish}>
              Generate readiness report
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentFlow;
