'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import styles from './EbookDetail.module.css';

export default function EbookDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchEbook = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/ebooks/${params.id}`);
        const data = await res.json();
        
        if (res.ok) {
          setEbook(data);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch ebook details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEbook();
    }
  }, [params.id]);

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setPurchasing(true);
    try {
      const res = await fetch('http://localhost:5000/api/transactions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ ebookId: ebook._id })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      alert(err.message || 'Purchase failed');
      setPurchasing(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:5000/api/users/wishlist/${ebook._id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      if (res.ok) {
        alert('Bookmark updated!');
      } else {
        const data = await res.json();
        throw new Error(data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading Ebook...</p>
      </div>
    );
  }

  if (error || !ebook) {
    return (
      <div className={styles.errorContainer}>
        <h2>Oops!</h2>
        <p>{error || 'Ebook not found'}</p>
        <button onClick={() => router.push('/browse')} className={styles.backBtn}>Back to Browse</button>
      </div>
    );
  }

  const isWriter = user && ebook.writer && user._id === (ebook.writer._id || ebook.writer);
  const isPurchased = user && user.purchasedEbooks?.includes(ebook._id);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        
        {/* Cover Image */}
        <div className={styles.imageCol}>
          <div className={styles.imageWrapper}>
            <img src={ebook.coverImage} alt={ebook.title} />
            {ebook.status === 'sold' && <div className={styles.soldBadge}>Sold</div>}
          </div>
        </div>

        {/* Info Column */}
        <div className={styles.infoCol}>
          <div className={styles.headerInfo}>
            <span className={styles.genre}>{ebook.genre}</span>
            <span className={styles.date}>Uploaded: {new Date(ebook.createdAt).toLocaleDateString()}</span>
          </div>
          
          <h1 className={styles.title}>{ebook.title}</h1>
          <p className={styles.writer}>
            By <span className={styles.writerName}>{ebook.writer?.fullName || 'Unknown'}</span>
          </p>
          
          <div className={styles.priceContainer}>
            <span className={styles.priceLabel}>Price</span>
            <span className={styles.price}>${ebook.price.toFixed(2)}</span>
          </div>

          <div className={styles.description}>
            <h3>Synopsis</h3>
            <p>{ebook.description}</p>
          </div>

          <div className={styles.actions}>
            {isPurchased ? (
              <button className={styles.purchasedBtn} disabled>Already Purchased</button>
            ) : (
              <button 
                className={styles.purchaseBtn} 
                onClick={handlePurchase}
                disabled={isWriter || purchasing || ebook.status === 'sold'}
              >
                {purchasing ? 'Processing...' : isWriter ? 'You are the writer' : ebook.status === 'sold' ? 'Sold Out' : 'Buy Now'}
              </button>
            )}
            
            <button className={styles.bookmarkBtn} onClick={handleBookmark}>
              Bookmark
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
