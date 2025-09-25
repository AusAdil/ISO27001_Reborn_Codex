import React, { useEffect, useState } from 'react';
import axios from 'axios';

import AssessmentFlow from './components/AssessmentFlow.jsx';
import ErrorBanner from './components/ErrorBanner.jsx';
import LearningHub from './components/LearningHub.jsx';
import LoadingState from './components/LoadingState.jsx';
import OnboardingWizard from './components/OnboardingWizard.jsx';
import ResultsDashboard from './components/ResultsDashboard.jsx';

const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const buildUrl = (path) => (API_BASE ? `${API_BASE}${path}` : path);

const App = () => {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [options, setOptions] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [learning, setLearning] = useState({});
  const [onboarding, setOnboarding] = useState(null);
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);
  const [view, setView] = useState('onboarding');

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

  const handleOnboardingComplete = (details) => {
    setOnboarding(details);
    setResponses({});
    setView('assessment');
    setResult(null);
  };

  const handleResponseUpdate = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        ...value
      }
    }));
  };

  const handleSubmitAssessment = async () => {
    try {
      setStatus('submitting');
      const payload = {
        onboarding,
        responses: Object.entries(responses)
          .filter(([, value]) => value && value.answer !== undefined && value.answer !== '')
          .map(([id, value]) => ({
            id,
            answer: value.answer,
            notes: value.notes || '',
            evidence: value.evidence || ''
          }))
      };
      const { data } = await axios.post(buildUrl('/api/assess'), payload);
      setResult({ ...data, timestamp: data.timestamp || new Date().toISOString() });
      setView('results');
      setStatus('ready');
      setError('');
    } catch (submitError) {
      console.error(submitError);
      setError('We were unable to calculate your readiness. Please try again.');
      setStatus('ready');
    }
  };

  const handleRestart = () => {
    setOnboarding(null);
    setResponses({});
    setResult(null);
    setView('onboarding');
  };

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

  return (
    <div className="app-shell">
      <header>
        <h1>ISO 27001 Readiness Navigator</h1>
        <p>Complete the onboarding, respond to the tailored controls, and receive a prioritised roadmap with effort estimates.</p>
      </header>
      {error && <ErrorBanner message={error} />}
      {view === 'onboarding' && options && (
        <OnboardingWizard options={options} onComplete={handleOnboardingComplete} initial={onboarding} />
      )}
      {view === 'assessment' && questions.length > 0 && onboarding && (
        <AssessmentFlow
          questions={questions}
          responses={responses}
          onUpdate={handleResponseUpdate}
          onSubmit={handleSubmitAssessment}
          onBack={() => setView('onboarding')}
        />
      )}
      {view === 'results' && result && (
        <ResultsDashboard
          result={result}
          onRestart={handleRestart}
          onViewLearning={() => setView('learning')}
        />
      )}
      {view === 'learning' && result && (
        <LearningHub learning={learning} onBack={() => setView('results')} />
      )}
    </div>
  );
};

export default App;
