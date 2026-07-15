'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import styles from './EbookDetail.module.css';
import { API_URL } from '../../../utils/api';

export default function EbookDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const fetchEbook = async () => {
    try {
      const headers = {};
      if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
      
      const res = await fetch(`${API_URL}/api/ebooks/${params.id}`, { headers });
      const data = await res.json();
      
      if (res.ok) {
        setEbook(data);
        // Check if bookmarked
        if (user && user.wishlist) {
          setIsBookmarked(user.wishlist.includes(data._id) || (data.wishlist && data.wishlist.includes(user._id)));
        }
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch ebook details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchEbook();
    }
  }, [params.id, user]);

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setPurchasing(true);
    try {
      const res = await fetch(`${API_URL}/api/transactions/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ ebookId: ebook._id })
      });
      
      const data = await res.json();
      
      if (res.ok) {
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
      const res = await fetch(`${API_URL}/api/users/wishlist/${ebook._id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(!isBookmarked);
        alert(isBookmarked ? 'Removed from Bookmarks!' : 'Added to Bookmarks!');
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
  const isPurchased = user && (user.purchasedEbooks?.includes(ebook._id) || ebook.content !== undefined);
  const isAdmin = user && user.role === 'admin';

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
            {isPurchased || isWriter || isAdmin ? (
              <span className={styles.purchasedTag}>Access Granted</span>
            ) : (
              <button 
                className={styles.purchaseBtn} 
                onClick={handlePurchase}
                disabled={purchasing || ebook.status === 'sold'}
              >
                {purchasing ? 'Processing...' : ebook.status === 'sold' ? 'Sold Out' : 'Buy Now'}
              </button>
            )}
            
            <button className={isBookmarked ? styles.bookmarkedBtn : styles.bookmarkBtn} onClick={handleBookmark}>
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>
        </div>
      </div>

      {/* Full Content reading box for buyers, owners or admins */}
      {(isPurchased || isWriter || isAdmin) && ebook.content && (
        <div className={styles.readSection}>
          <h2>📖 Read Book Content</h2>
          <div className={styles.contentBox}>
            {ebook.content.split('\n').map((para, i) => (
              <p key={i} className={styles.paragraph}>{para}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
