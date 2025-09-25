import React, { useMemo, useState } from 'react';

const DEFAULT_FORM = {
  organisationName: '',
  organisationSize: '',
  industry: '',
  locations: [],
  hostingModel: [],
  remoteWork: null,
  supplierReliance: '',
  criticalAssets: [],
  notes: ''
};

const OnboardingWizard = ({ options, onComplete, initial }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => ({
    ...DEFAULT_FORM,
    ...initial,
    locations: initial?.locations || DEFAULT_FORM.locations,
    hostingModel: initial?.hostingModel || DEFAULT_FORM.hostingModel,
    criticalAssets: initial?.criticalAssets || DEFAULT_FORM.criticalAssets
  }));

  const locationText = useMemo(() => form.locations.join('\n'), [form.locations]);

  const toggleMultiValue = (field, value) => {
    setForm((prev) => {
      const values = new Set(prev[field]);
      if (values.has(value)) {
        values.delete(value);
      } else {
        values.add(value);
      }
      return { ...prev, [field]: Array.from(values) };
    });
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (value) => {
    const items = value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, locations: items }));
  };

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
              required
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
          </div>
          <div className="card">
            <label htmlFor="industry">Industry</label>
            <select
              id="industry"
              value={form.industry}
              onChange={(event) => handleChange('industry', event.target.value)}
              required
            >
              <option value="" disabled>
                Select industry
              </option>
              {options.industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
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
                const selected = form.hostingModel.includes(model);
                return (
                  <button
                    key={model}
                    type="button"
                    className={`secondary ${selected ? 'selected' : ''}`}
                    onClick={() => toggleMultiValue('hostingModel', model)}
                    aria-pressed={selected}
                  >
                    {selected ? '✓ ' : ''}
                    {model === 'cloud' ? 'Cloud' : 'On-premises'}
                  </button>
                );
              })}
            </div>
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
          </div>
          <div className="card">
            <label htmlFor="locations">Locations in scope</label>
            <textarea
              id="locations"
              value={locationText}
              onChange={(event) => handleLocationChange(event.target.value)}
              placeholder={'Sydney\nMelbourne'}
            />
            <small style={{ color: '#486581' }}>Enter one location per line.</small>
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

  const canContinue = () => {
    if (step === 0) {
      return Boolean(form.organisationSize && form.industry);
    }
    if (step === 1) {
      return form.remoteWork !== null;
    }
    return Boolean(form.supplierReliance);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onComplete({ ...form });
  };

  return (
    <form className="grid" style={{ gap: '16px' }} onSubmit={handleSubmit}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
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
          <button
            type="button"
            className="secondary"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            disabled={step === 0}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button type="button" onClick={() => canContinue() && setStep((value) => Math.min(steps.length - 1, value + 1))} disabled={!canContinue()}>
              Next
            </button>
          ) : (
            <button type="submit" disabled={!canContinue()}>
              Start assessment
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default OnboardingWizard;
