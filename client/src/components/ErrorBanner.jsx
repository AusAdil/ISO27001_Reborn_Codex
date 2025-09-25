import React from 'react';

const ErrorBanner = ({ message }) => (
  <div className="error-banner" role="alert">
    <strong>Something went wrong.</strong>
    <div>{message}</div>
  </div>
);

export default ErrorBanner;
