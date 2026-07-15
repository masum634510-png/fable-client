'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import styles from '../login/Login.module.css'; // Re-use basic card container styles
import Link from 'next/link';
import { API_URL } from '../../utils/api';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const sessionId = searchParams.get('session_id');
  const ebookId = searchParams.get('ebook_id');

  useEffect(() => {
    const confirmPayment = async () => {
      if (!user || !sessionId || !ebookId) return;

      try {
        const res = await fetch(`${API_URL}/api/transactions/success`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({
            session_id: sessionId,
            ebook_id: ebookId
          })
        });

        const data = await res.json();
        if (res.ok) {
          setSuccess(true);
          setMessage(data.message || 'Payment confirmed, Ebook added to your library!');
        } else {
          setMessage(data.message || 'Verification failed. Please contact support.');
        }
      } catch (err) {
        console.error('Payment verify error', err);
        setMessage('Network error verifying payment.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      confirmPayment();
    } else {
      // If user session is restoring, wait for it. If not logged in after 3 seconds, redirect.
      const timer = setTimeout(() => {
        if (!user) {
          setMessage('Please login to complete payment verification.');
          setLoading(false);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, sessionId, ebookId]);

  return (
    <div className={styles.container} style={{ minHeight: '70vh' }}>
      <div className={styles.formCard} style={{ textAlign: 'center', padding: '3rem' }}>
        {loading ? (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <h3>Verifying Payment Transaction...</h3>
            <p className="text-gray-500">Please do not close this window.</p>
          </div>
        ) : success ? (
          <div>
            <div className="text-green-500 text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Thank you for your purchase!</h2>
            <p className="mb-6">{message}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href={`/ebook/${ebookId}`} style={{
                background: 'var(--primary)',
                color: '#fff',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600'
              }}>
                Read Ebook Now
              </Link>
              <Link href="/dashboard/user" style={{
                border: '1px solid var(--border)',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600'
              }}>
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-red-500 text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Verification Failed</h2>
            <p className="mb-6">{message}</p>
            <Link href="/browse" style={{
              background: 'var(--primary)',
              color: '#fff',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              Browse Ebooks
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading success confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
