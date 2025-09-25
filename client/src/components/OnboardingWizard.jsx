import React, { useMemo, useState } from 'react';
import ChipInput from './ChipInput.jsx';

const DEFAULT_FORM = {
  organisationName: '',
  organisationSize: '',
  industry: '',
  locations: [],
  hostingModel: [],
  remoteWork: null,
  supplierReliance: '',
  criticalAssets: [],
  exclusionsText: '',
  annexAExclusions: [],
  notes: ''
};

const createInitialState = (initial = {}) => {
  const safeInitial = initial && typeof initial === 'object' ? initial : {};
  return {
    ...DEFAULT_FORM,
    ...safeInitial,
    locations: Array.isArray(safeInitial.locations) ? safeInitial.locations : DEFAULT_FORM.locations,
    hostingModel: Array.isArray(safeInitial.hostingModel) ? safeInitial.hostingModel : DEFAULT_FORM.hostingModel,
    criticalAssets: Array.isArray(safeInitial.criticalAssets) ? safeInitial.criticalAssets : DEFAULT_FORM.criticalAssets,
    annexAExclusions: Array.isArray(safeInitial.annexAExclusions)
      ? safeInitial.annexAExclusions
      : DEFAULT_FORM.annexAExclusions
  };
};

const stepValidators = [
  (form) => {
    const errors = {};
    if (!form.organisationSize) {
      errors.organisationSize = 'Select your organisation size.';
    }
    if (!form.industry) {
      errors.industry = 'Choose the primary industry you operate in.';
    }
    return errors;
  },
  (form) => {
    const errors = {};
    if (!form.hostingModel || form.hostingModel.length === 0) {
      errors.hostingModel = 'Select at least one hosting model in use.';
    }
    if (form.remoteWork === null) {
      errors.remoteWork = 'Let us know if remote work is supported.';
    }
    return errors;
  },
  (form) => {
    const errors = {};
    if (!form.supplierReliance) {
      errors.supplierReliance = 'Choose how reliant you are on suppliers.';
    }
    return errors;
  }
];

const OnboardingWizard = ({ options, onComplete, initial }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => createInitialState(initial));

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMultiValue = (field, value) => {
    setForm((prev) => {
      const next = new Set(prev[field] || []);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return { ...prev, [field]: Array.from(next) };
    });
  };

  const validation = stepValidators[step](form);
  const displayErrors = validation;
  const isStepValid = Object.keys(validation).length === 0;

  const handleNext = () => {
    if (!isStepValid) {
      return;
    }
    setStep((value) => Math.min(value + 1, 2));
  };

  const handleBack = () => {
    setStep((value) => Math.max(value - 1, 0));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isStepValid) {
      onComplete({ ...form });
    }
  };

  const hostingModelLabels = useMemo(
    () => Object.fromEntries(options.hostingModels.map((model) => [model.id, model.label])),
    [options.hostingModels]
  );

  const steps = [
    {
      title: 'Organisation profile',
      description: 'Help us tailor the catalogue to your organisation size and industry context.',
      content: (
        <div className="grid" style={{ gap: '16px' }}>
          <div className="card">
            <label htmlFor="organisation-name">Organisation name (optional)</label>
            <input
              id="organisation-name"
              type="text"
              value={form.organisationName}
              onChange={(event) => handleChange('organisationName', event.target.value)}
              placeholder="Acme Pty Ltd"
            />
          </div>
          <div className="card">
            <label htmlFor="organisation-size">Organisation size</label>
            <select
              id="organisation-size"
              value={form.organisationSize}
              onChange={(event) => handleChange('organisationSize', event.target.value)}
            >
              <option value="" disabled>
                Select size band
              </option>
              {options.organisationSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {displayErrors.organisationSize && <small className="error-text">{displayErrors.organisationSize}</small>}
          </div>
          <div className="card">
            <label htmlFor="industry">Industry</label>
            <select id="industry" value={form.industry} onChange={(event) => handleChange('industry', event.target.value)}>
              <option value="" disabled>
                Select industry
              </option>
              {options.industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            {displayErrors.industry && <small className="error-text">{displayErrors.industry}</small>}
          </div>
        </div>
      )
    },
    {
      title: 'Scope and footprint',
      description: 'Tell us where information is stored and accessed so we can exclude out-of-scope controls.',
      content: (
        <div className="grid" style={{ gap: '16px' }}>
          <div className="card">
            <label>Hosting model</label>
            <div className="chip-row" role="group" aria-label="Hosting model">
              {options.hostingModels.map((model) => {
                const selected = form.hostingModel.includes(model.id);
                return (
                  <button
                    key={model.id}
                    type="button"
                    className={`secondary ${selected ? 'selected' : ''}`}
                    onClick={() => toggleMultiValue('hostingModel', model.id)}
                    aria-pressed={selected}
                  >
                    {selected ? '✓ ' : ''}
                    {hostingModelLabels[model.id]}
                  </button>
                );
              })}
            </div>
            {displayErrors.hostingModel && <small className="error-text">{displayErrors.hostingModel}</small>}
          </div>
          <div className="card">
            <label>Do you support remote work?</label>
            <div className="chip-row" role="radiogroup" aria-label="Remote work">
              {[
                { label: 'Yes', value: true },
                { label: 'No', value: false }
              ].map((option) => {
                const selected = form.remoteWork === option.value;
                return (
                  <button
                    key={option.label}
                    type="button"
                    className={`secondary ${selected ? 'selected' : ''}`}
                    onClick={() => handleChange('remoteWork', option.value)}
                    aria-pressed={selected}
                  >
                    {selected ? '✓ ' : ''}
                    {option.label}
                  </button>
                );
              })}
            </div>
            {displayErrors.remoteWork && <small className="error-text">{displayErrors.remoteWork}</small>}
          </div>
          <div className="card">
            <ChipInput
              id="locations"
              label="Locations in scope (optional)"
              values={form.locations}
              onChange={(values) => handleChange('locations', values)}
              placeholder="Melbourne Head Office"
              helperText={
                form.locations.length === 0
                  ? 'Add key sites to tune physical controls (press Enter after each location).'
                  : 'Press Enter after each location to add a chip.'
              }
            />
          </div>
          <div className="card">
            <label htmlFor="exclusions-text">Exclusions & boundaries (optional)</label>
            <textarea
              id="exclusions-text"
              value={form.exclusionsText}
              onChange={(event) => handleChange('exclusionsText', event.target.value)}
              placeholder="Note any business units, services or facilities that sit outside your ISO scope."
            />
            <ChipInput
              id="annex-exclusions"
              label="Annex A controls excluded (optional)"
              values={form.annexAExclusions}
              onChange={(values) => handleChange('annexAExclusions', values)}
              placeholder="A.7.9"
              helperText="Enter control identifiers (e.g. A.7.9) and press Enter to add."
            />
          </div>
        </div>
      )
    },
    {
      title: 'Critical services and suppliers',
      description: 'Understanding your suppliers and critical assets fine-tunes the weighting model.',
      content: (
        <div className="grid" style={{ gap: '16px' }}>
          <div className="card">
            <label>Supplier reliance</label>
            <div className="chip-row" role="radiogroup" aria-label="Supplier reliance">
              {options.supplierReliance.map((level) => {
                const selected = form.supplierReliance === level;
                return (
                  <button
                    key={level}
                    type="button"
                    className={`secondary ${selected ? 'selected' : ''}`}
                    onClick={() => handleChange('supplierReliance', level)}
                    aria-pressed={selected}
                  >
                    {selected ? '✓ ' : ''}
                    {level}
                  </button>
                );
              })}
            </div>
            {displayErrors.supplierReliance && <small className="error-text">{displayErrors.supplierReliance}</small>}
          </div>
          <div className="card">
            <label>Critical asset types</label>
            <div className="chip-row" role="group" aria-label="Critical assets">
              {options.criticalAssets.map((asset) => {
                const selected = form.criticalAssets.includes(asset);
                return (
                  <button
                    key={asset}
                    type="button"
                    className={`secondary ${selected ? 'selected' : ''}`}
                    onClick={() => toggleMultiValue('criticalAssets', asset)}
                    aria-pressed={selected}
                  >
                    {selected ? '✓ ' : ''}
                    {asset}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="card">
            <label htmlFor="notes">Additional notes (optional)</label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(event) => handleChange('notes', event.target.value)}
              placeholder="Anything else we should consider?"
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <form className="grid" style={{ gap: '16px' }} onSubmit={handleSubmit}>
      <div className="card">
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}
        >
          <div>
            <h2 style={{ marginBottom: 4 }}>{steps[step].title}</h2>
            <p style={{ margin: 0, color: '#486581' }}>{steps[step].description}</p>
          </div>
          <div className="score-badge" aria-live="polite">
            Step {step + 1} of {steps.length}
          </div>
        </div>
        <div style={{ marginTop: 24 }}>{steps[step].content}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          <button type="button" className="secondary" onClick={handleBack} disabled={step === 0}>
            Back
          </button>
          {step < steps.length - 1 ? (
            <button type="button" onClick={handleNext} disabled={!isStepValid}>
              Next
            </button>
          ) : (
            <button type="submit" disabled={!isStepValid}>
              Start assessment
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default OnboardingWizard;
