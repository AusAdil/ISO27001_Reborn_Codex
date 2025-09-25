import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import AssessmentFlow from './components/AssessmentFlow.jsx';
import ErrorBanner from './components/ErrorBanner.jsx';
import LearningHub from './components/LearningHub.jsx';
import LoadingState from './components/LoadingState.jsx';
import OnboardingWizard from './components/OnboardingWizard.jsx';
import ResultsDashboard from './components/ResultsDashboard.jsx';

const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const buildUrl = (path) => (API_BASE ? `${API_BASE}${path}` : path);

const serialiseResponses = (responses) =>
  Object.entries(responses)
    .map(([id, value]) => ({
      id,
      answer: value.answer ?? null,
      notes: value.notes || '',
      evidence: Array.isArray(value.evidence) ? value.evidence : [],
      evidenceVerified: Boolean(value.evidenceVerified),
      skipped: Boolean(value.skipped)
    }))
    .filter((entry) => entry.answer !== null || entry.notes || entry.evidence.length > 0 || entry.skipped);

const App = () => {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [options, setOptions] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [learning, setLearning] = useState({});
  const [onboarding, setOnboarding] = useState(null);
  const [responses, setResponses] = useState({});
  const [scorePreview, setScorePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [view, setView] = useState('onboarding');
  const [scopeNotice, setScopeNotice] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [opt, qs, learn] = await Promise.all([
          axios.get(buildUrl('/api/onboarding-options')),
          axios.get(buildUrl('/api/questions')),
          axios.get(buildUrl('/api/learning'))
        ]);
        setOptions(opt.data);
        setQuestions(qs.data);
        setLearning(learn.data);
        setStatus('ready');
      } catch (fetchError) {
        console.error(fetchError);
        setError('We could not load the assessment data. Please ensure the API is running on port 4000.');
        setStatus('error');
      }
    };

    fetchData();
  }, []);

  const handleResponseUpdate = (questionId, update) => {
    setResponses((prev) => {
      const existing = prev[questionId] || { evidence: [] };
      const next = { ...existing, ...update };

      if (update.answer !== undefined) {
        next.answer = update.answer === null ? null : String(update.answer);
      }
      if (update.evidence !== undefined) {
        next.evidence = Array.isArray(update.evidence) ? update.evidence.map((item) => ({ ...item })) : [];
      } else if (!next.evidence) {
        next.evidence = [];
      }
      if (next.skipped && next.answer) {
        next.answer = null;
      }

      return {
        ...prev,
        [questionId]: next
      };
    });
  };

  const handleOnboardingComplete = async (details) => {
    try {
      setStatus('submitting');
      const payload = {
        onboarding: details,
        answers: serialiseResponses(responses),
        preview: true
      };
      const { data } = await axios.post(buildUrl('/api/score'), payload);
      const nextItems = data.items || [];
      const itemMap = new Map(nextItems.map((item) => [item.id, item]));
      const nextResponses = {};
      const dropped = [];

      Object.entries(responses).forEach(([id, response]) => {
        const meta = itemMap.get(id);
        if (meta && meta.inScope !== false) {
          nextResponses[id] = response;
        } else if (response && (response.answer || response.notes || (response.evidence && response.evidence.length))) {
          dropped.push(id);
        }
      });

      setResponses(nextResponses);
      setOnboarding(details);
      setScorePreview(data);
      setView('assessment');
      setStatus('ready');
      setError('');
      if (dropped.length > 0) {
        const droppedLabels = questions
          .filter((question) => dropped.includes(question.id))
          .map((question) => question.control || question.id);
        setScopeNotice(
          `Removed ${dropped.length} ${dropped.length === 1 ? 'control' : 'controls'} now out of scope: ${droppedLabels.join(', ')}.`
        );
      } else {
        setScopeNotice('');
      }
    } catch (submitError) {
      console.error(submitError);
      setError('We could not save your scope. Please try again.');
      setStatus('ready');
    }
  };

  const handleSubmitAssessment = async () => {
    if (!onboarding) {
      return;
    }
    try {
      setStatus('submitting');
      const payload = {
        onboarding,
        answers: serialiseResponses(responses)
      };
      const { data } = await axios.post(buildUrl('/api/score'), payload);
      setResult({ ...data, timestamp: new Date().toISOString(), onboarding });
      setScorePreview(data);
      setView('results');
      setStatus('ready');
      setError('');
    } catch (errorSubmit) {
      console.error(errorSubmit);
      setError('We were unable to calculate your readiness. Please try again.');
      setStatus('ready');
    }
  };

  const handleSubmitWithRatio = (ratio) => {
    if (ratio < 0.8) {
      setScopeNotice('Fewer than 80% of in-scope controls were answered. Your results highlight answered areas only.');
    }
    handleSubmitAssessment();
  };

  const handleAdjustScope = () => {
    const confirmed = window.confirm('Changing scope may reset some answers. Continue?');
    if (confirmed) {
      setView('onboarding');
    }
  };

  const handleRestart = () => {
    setOnboarding(null);
    setResponses({});
    setScorePreview(null);
    setResult(null);
    setScopeNotice('');
    setView('onboarding');
  };

  const activeQuestions = useMemo(() => {
    if (!scorePreview || !scorePreview.items) {
      return questions;
    }
    const map = new Map(scorePreview.items.map((item) => [item.id, item]));
    return questions.filter((question) => {
      const meta = map.get(question.id);
      return !meta || meta.inScope !== false;
    });
  }, [questions, scorePreview]);

  if (status === 'loading') {
    return (
      <div className="app-shell">
        <header>
          <h1>ISO 27001 Readiness Navigator</h1>
          <p>A guided diagnostic to visualise your ISO 27001:2022 posture and plan practical next steps.</p>
        </header>
        <LoadingState />
      </div>
    );
  }

  if (status === 'submitting') {
    return (
      <div className="app-shell">
        <header>
          <h1>ISO 27001 Readiness Navigator</h1>
          <p>A guided diagnostic to visualise your ISO 27001:2022 posture and plan practical next steps.</p>
        </header>
        <LoadingState label="Crunching the numbers…" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="app-shell">
        <header>
          <h1>ISO 27001 Readiness Navigator</h1>
          <p>A guided diagnostic to visualise your ISO 27001:2022 posture and plan practical next steps.</p>
        </header>
        <ErrorBanner message={error} />
      </div>
    );
  }

  const previewItems = scorePreview ? scorePreview.items || [] : [];

  return (
    <div className="app-shell">
      <header>
        <h1>ISO 27001 Readiness Navigator</h1>
        <p>Complete the onboarding, respond to the tailored controls, and receive a prioritised roadmap with effort estimates.</p>
      </header>
      {error && <ErrorBanner message={error} />}
      {scopeNotice && <div className="info-banner">{scopeNotice}</div>}
      {view === 'onboarding' && options && (
        <OnboardingWizard options={options} onComplete={handleOnboardingComplete} initial={onboarding} />
      )}
      {view === 'assessment' && onboarding && (
        <AssessmentFlow
          questions={activeQuestions}
          previewItems={previewItems}
          responses={responses}
          onUpdate={handleResponseUpdate}
          onSubmit={handleSubmitWithRatio}
          onAdjustScope={handleAdjustScope}
          buildUrl={buildUrl}
        />
      )}
      {view === 'results' && result && (
        <ResultsDashboard
          result={result}
          onRestart={handleRestart}
          onViewLearning={() => setView('learning')}
          onResetBaseline={async () => {
            try {
              await axios.post(buildUrl('/api/baseline/reset'));
              setScopeNotice('Baseline has been reset. The next completed assessment will capture a new baseline.');
            } catch (resetError) {
              console.error(resetError);
              setError('We could not reset the baseline just now.');
            }
          }}
        />
      )}
      {view === 'learning' && result && (
        <LearningHub learning={learning} onBack={() => setView('results')} />
      )}
    </div>
  );
};

export default App;
