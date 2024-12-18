import React from 'react';
import './formError.scss';

export default function FormError({ error }) {
  return (
    <div className={`formError ${error ? 'visible' : ''}`}>{error}</div>
  );
}
