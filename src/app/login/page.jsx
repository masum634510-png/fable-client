'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const triggerGoogleLogin = async (roleType) => {
    try {
      const email = roleType === 'writer' ? 'google_writer@fable.com' : 'google_reader@fable.com';
      const name = roleType === 'writer' ? 'Google Writer' : 'Google Reader';
      
      await loginWithGoogle({
        email,
        name,
        googleId: `google_${roleType}_123456`,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${roleType}`
      });
      setShowGoogleModal(false);
    } catch (err) {
      setError(err.message || 'Google Login failed');
    }
  };

  const handleGoogleLogin = () => {
    setShowGoogleModal(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2>Welcome Back to Fable</h2>
        <p className={styles.subtitle}>Login to continue reading</p>
        
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className={styles.submitBtn}>Login</button>
        </form>

        <div className={styles.divider}><span>OR</span></div>
        
        <button onClick={handleGoogleLogin} className={styles.googleBtn}>
          Continue with Google
        </button>

        <p className={styles.footerText}>
          Don't have an account? <Link href="/register">Register here</Link>
        </p>
      </div>

      {showGoogleModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'var(--card-bg, #fff)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '2rem', maxWidth: '400px', width: '90%',
            display: 'flex', flexDirection: 'column', gap: '1.2rem', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            color: 'var(--foreground)'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', textAlign: 'center' }}>BetterAuth Google Account</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, textAlign: 'center', marginBottom: '0.5rem' }}>Select a simulated Google Account to sign-in instantly:</p>
            
            <button 
              onClick={() => triggerGoogleLogin('user')}
              style={{
                background: 'var(--secondary)', color: 'var(--foreground)', padding: '1rem',
                borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer',
                fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.8rem',
                textAlign: 'left'
              }}
            >
              <span>👤</span> Google Reader (Reader Role)
            </button>
            
            <button 
              onClick={() => triggerGoogleLogin('writer')}
              style={{
                background: 'var(--secondary)', color: 'var(--foreground)', padding: '1rem',
                borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer',
                fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.8rem',
                textAlign: 'left'
              }}
            >
              <span>✍️</span> Google Writer (Writer Role)
            </button>
            
            <button 
              onClick={() => setShowGoogleModal(false)}
              style={{
                background: 'transparent', color: 'red', border: 'none',
                cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', marginTop: '0.5rem',
                alignSelf: 'center'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
