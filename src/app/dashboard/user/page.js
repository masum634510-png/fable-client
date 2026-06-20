'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../Dashboard.module.css';
import Link from 'next/link';

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && user.role !== 'user') {
      router.push(`/dashboard/${user.role}`);
    } else if (user) {
      fetchProfile();
    }
  }, [user, authLoading, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) setProfileData(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || !profileData) return <div>Loading dashboard...</div>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <h3>Reader Dashboard</h3>
        <div 
          className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </div>
        <div 
          className={`${styles.navItem} ${activeTab === 'purchases' ? styles.active : ''}`}
          onClick={() => setActiveTab('purchases')}
        >
          My Library
        </div>
        <div 
          className={`${styles.navItem} ${activeTab === 'bookmarks' ? styles.active : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          Bookmarks
        </div>
      </div>

      <div className={styles.mainContent}>
        {activeTab === 'profile' && (
          <div>
            <div className={styles.header}><h2>My Profile</h2></div>
            <div className={styles.profileCard}>
              <img src={profileData.profilePicture} alt="Avatar" className={styles.avatar} />
              <div className={styles.profileInfo}>
                <h3>{profileData.fullName}</h3>
                <p>{profileData.email}</p>
                <p>Role: Reader</p>
                <p>Member Since: {new Date(profileData.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div>
            <div className={styles.header}><h2>My Library</h2></div>
            {profileData.purchasedEbooks?.length === 0 ? (
              <p>You haven't purchased any ebooks yet. <Link href="/browse">Browse Ebooks</Link></p>
            ) : (
              <div className={styles.cardGrid}>
                {profileData.purchasedEbooks.map(ebook => (
                  <Link href={`/ebook/${ebook._id}`} key={ebook._id}>
                    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', background: 'var(--background)' }}>
                      <img src={ebook.coverImage} alt="Cover" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                      <h4 style={{ marginTop: '1rem' }}>{ebook.title}</h4>
                      <p style={{ color: 'var(--primary)' }}>Read Now</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div>
            <div className={styles.header}><h2>Bookmarks</h2></div>
            {profileData.wishlist?.length === 0 ? (
              <p>No bookmarked ebooks.</p>
            ) : (
              <div className={styles.cardGrid}>
                {profileData.wishlist.map(ebook => (
                  <Link href={`/ebook/${ebook._id}`} key={ebook._id}>
                    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', background: 'var(--background)' }}>
                      <img src={ebook.coverImage} alt="Cover" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                      <h4 style={{ marginTop: '1rem' }}>{ebook.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
