'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>⚠️</div>
      <h2 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '1rem', color: '#ef4444' }}>Something went wrong!</h2>
      <p style={{ color: 'var(--foreground)', opacity: 0.7, marginBottom: '2.5rem', fontSize: '1.1rem' }}>
        An unexpected error occurred during execution. Please try reloading the page.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => reset()}
          style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1rem 2.5rem', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)' }}
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)', padding: '1rem 2.5rem', borderRadius: '50px', border: '1px solid var(--border)', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
