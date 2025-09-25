import React from 'react';

const LoadingState = ({ label = 'Loading assessment data…' }) => (
  <div className="card loading-indicator" aria-busy="true">
    <div className="spinner" aria-hidden="true"></div>
    <p style={{ margin: 0, color: '#486581' }}>{label}</p>
  </div>
);

export default LoadingState;
