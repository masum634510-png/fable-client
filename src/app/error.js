'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ef4444' }}>Something went wrong!</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We apologize for the inconvenience.</p>
      <button
        onClick={() => reset()}
        style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Try again
      </button>
    </div>
  );
}
