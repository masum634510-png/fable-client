'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = () => {
    // In a real app, this would use BetterAuth or next-auth to trigger Google OAuth
    // Here we simulate it
    alert('Google login simulation clicked');
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
    </div>
  );
}
