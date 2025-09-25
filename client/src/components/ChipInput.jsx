import React, { useState } from 'react';

const ChipInput = ({
  id,
  label,
  values,
  onChange,
  placeholder = '',
  helperText = '',
  error = ''
}) => {
  const [draft, setDraft] = useState('');

  const normalise = (value) => value.trim().replace(/\s{2,}/g, ' ');

  const addValue = (value) => {
    const next = normalise(value);
    if (!next) {
      return;
    }
    if (values.some((item) => item.toLowerCase() === next.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...values, next]);
    setDraft('');
  };

  const removeValue = (value) => {
    onChange(values.filter((item) => item !== value));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addValue(draft);
    }
    if (event.key === 'Backspace' && !draft && values.length > 0) {
      removeValue(values[values.length - 1]);
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (value.includes(',')) {
      const parts = value.split(',');
      parts.slice(0, -1).forEach(addValue);
      setDraft(parts[parts.length - 1]);
      return;
    }
    setDraft(value);
  };

  const handleBlur = () => {
    addValue(draft);
  };

  return (
    <div className="chip-input">
      {label && (
        <label htmlFor={id}>
          {label}
        </label>
      )}
      <div className={`chip-input__wrapper ${error ? 'has-error' : ''}`}>
        {values.map((value) => (
          <span key={value} className="chip" role="listitem">
            {value}
            <button type="button" aria-label={`Remove ${value}`} onClick={() => removeValue(value)}>
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          aria-describedby={helperText ? `${id}-helper` : undefined}
        />
      </div>
      {helperText && (
        <small id={`${id}-helper`} className="helper-text">
          {helperText}
        </small>
      )}
      {error && (
        <small className="error-text" role="alert">
          {error}
        </small>
      )}
    </div>
  );
};

export default ChipInput;
