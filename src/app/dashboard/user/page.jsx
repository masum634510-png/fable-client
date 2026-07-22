'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../Dashboard.module.css';
import Link from 'next/link';
import { API_URL } from '../../../utils/api';

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(null);
  
  // Profile update state
  const [fullName, setFullName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Purchase history state
  const [purchases, setPurchases] = useState([]);
  const [purchasesLoading, setPurchasesLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        setFullName(data.fullName || user.fullName || '');
      } else {
        // Fallback to auth user if endpoint returns non-ok
        setProfileData(user);
        setFullName(user.fullName || '');
      }
    } catch (err) {
      console.error(err);
      setProfileData(user);
      setFullName(user?.fullName || '');
    }
  };

  const fetchPurchases = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch(`${API_URL}/api/transactions/my-purchases`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPurchases(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPurchasesLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && user.role !== 'user') {
      router.push(`/dashboard/${user.role}`);
    } else if (user) {
      fetchProfile();
      fetchPurchases();
    }
  }, [user, authLoading, router]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const imgBBKey = 'bdf33db9b964ffc73bf5404439c279c6';
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgBBKey}`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        const imageUrl = data.data.url;
        await updateProfile(fullName, imageUrl);
        alert('Profile picture updated successfully!');
      } else {
        throw new Error('Image upload to imgBB failed');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async (nameVal, picUrl = null) => {
    setSaveLoading(true);
    try {
      const bodyData = { fullName: nameVal };
      if (picUrl) {
        bodyData.profilePicture = picUrl;
      }

      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify(bodyData)
      });
      
      const data = await res.json();
      if (res.ok) {
        setProfileData({ ...profileData, ...data });
        fetchProfile();
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(fullName);
    alert('Name updated successfully!');
  };

  const handlePurchase = async (ebookId) => {
    try {
      const res = await fetch(`${API_URL}/api/transactions/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({ ebookId })
      });
      
      const data = await res.json();
      if (res.ok) {
        window.location.href = data.url;
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      alert(err.message || 'Purchase failed');
    }
  };

  if (authLoading) return <div className={styles.loading}>Loading Reader Dashboard...</div>;

  const currentProfile = profileData || user || {};
  const avatarUrl = currentProfile.profilePicture || user?.profilePicture || "https://api.dicebear.com/7.x/avataaars/svg?seed=User";
  const userPurchasedEbooks = Array.isArray(currentProfile.purchasedEbooks) ? currentProfile.purchasedEbooks : [];
  const userWishlist = Array.isArray(currentProfile.wishlist) ? currentProfile.wishlist : [];

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
          className={`${styles.navItem} ${activeTab === 'purchases-history' ? styles.active : ''}`}
          onClick={() => setActiveTab('purchases-history')}
        >
          Purchase History
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
              <div className={styles.avatarWrapper} style={{ position: 'relative', display: 'inline-block' }}>
                <img src={avatarUrl} alt="Avatar" className={styles.avatar} />
                <label className={styles.uploadOverlay} style={{
                  position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)',
                  borderRadius: '50%', width: '36px', height: '36px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff'
                }}>
                  📷
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
              </div>
              
              <div className={styles.profileInfo} style={{ marginTop: '1.5rem', width: '100%' }}>
                {uploading && <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Uploading photo...</p>}
                
                <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Full Name</label>
                    <input 
                      type="text" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      style={{ padding: '0.6rem', width: '100%', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Email Address</label>
                    <input 
                      type="email" 
                      value={currentProfile.email || user?.email || ''} 
                      disabled
                      style={{ padding: '0.6rem', width: '100%', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--secondary)', opacity: '0.7', cursor: 'not-allowed' }}
                    />
                  </div>
                  <button type="submit" disabled={saveLoading} style={{
                    background: 'var(--primary)', color: '#fff', padding: '0.7rem 1.2rem',
                    borderRadius: '6px', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-start'
                  }}>
                    {saveLoading ? 'Saving...' : 'Update Name'}
                  </button>
                </form>

                <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--foreground)', opacity: '0.7' }}>
                  <p>Role: Reader</p>
                  <p>Member Since: {currentProfile.createdAt ? new Date(currentProfile.createdAt).toLocaleDateString() : 'Active Reader'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div>
            <div className={styles.header}><h2>My Library</h2></div>
            {userPurchasedEbooks.length === 0 ? (
              <p>You haven't purchased any ebooks yet. <Link href="/browse" style={{ color: 'var(--primary)' }}>Browse Ebooks</Link></p>
            ) : (
              <div className={styles.cardGrid}>
                {userPurchasedEbooks.map(ebook => (
                  <Link href={`/ebook/${ebook._id}`} key={ebook._id}>
                    <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', background: 'var(--card-bg)', transition: 'all 0.3s' }}>
                      <img src={ebook.coverImage} alt="Cover" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px' }} />
                      <h4 style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>{ebook.title}</h4>
                      <p style={{ color: 'var(--primary)', marginTop: '0.5rem', fontWeight: '600' }}>📖 Read Now</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'purchases-history' && (
          <div>
            <div className={styles.header}><h2>Purchase History</h2></div>
            {purchasesLoading ? (
              <p>Loading purchase history...</p>
            ) : purchases.length === 0 ? (
              <p>You haven't purchased any ebooks yet. <Link href="/browse" style={{ color: 'var(--primary)' }}>Browse Ebooks</Link></p>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Ebook Title</th>
                      <th>Writer</th>
                      <th>Price</th>
                      <th>Purchase Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map(purchase => (
                      <tr key={purchase._id}>
                        <td style={{ fontWeight: 'bold' }}>{purchase.ebook?.title || 'Unknown Ebook'}</td>
                        <td>{purchase.ebook?.writer?.fullName || 'Anonymous'}</td>
                        <td>${(purchase.amount || 0).toFixed(2)}</td>
                        <td>{purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString() : 'Recent'}</td>
                        <td>
                          <span className={styles.badgeSuccess} style={{ display: 'inline-block', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            Success
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div>
            <div className={styles.header}><h2>Bookmarks</h2></div>
            {userWishlist.length === 0 ? (
              <p>No bookmarked ebooks.</p>
            ) : (
              <div className={styles.cardGrid}>
                {userWishlist.map(ebook => {
                  if (!ebook) return null;
                  const isPurchased = userPurchasedEbooks.some(b => b && String(b._id || b) === String(ebook._id));
                  const isWriter = ebook.writer === user?._id || ebook.writer?._id === user?._id;

                  return (
                    <Link href={`/ebook/${ebook._id}`} key={ebook._id}>
                      <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', background: 'var(--card-bg)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <img src={ebook.coverImage} alt="Cover" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px' }} />
                        <h4 style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 'bold', flexGrow: 1 }}>{ebook.title}</h4>
                        {isPurchased ? (
                          <span style={{ display: 'block', textAlign: 'center', marginTop: '0.8rem', background: '#22c55e', color: '#fff', padding: '0.5rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            Purchased
                          </span>
                        ) : isWriter ? (
                          <span style={{ display: 'block', textAlign: 'center', marginTop: '0.8rem', background: '#64748b', color: '#fff', padding: '0.5rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            My Book
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handlePurchase(ebook._id);
                            }}
                            disabled={ebook.status === 'sold'}
                            style={{
                              marginTop: '0.8rem',
                              background: ebook.status === 'sold' ? '#cbd5e1' : 'var(--primary)',
                              color: '#fff',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '6px',
                              cursor: ebook.status === 'sold' ? 'not-allowed' : 'pointer',
                              fontWeight: '600',
                              width: '100%'
                            }}
                          >
                            {ebook.status === 'sold' ? 'Sold Out' : `Buy Now ($${ebook.price})`}
                          </button>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
