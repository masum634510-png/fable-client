'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../Dashboard.module.css';
import Link from 'next/link';
import { API_URL } from '../../../utils/api';

export default function WriterDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('manage');
  
  const [ebooks, setEbooks] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Profile state for bookmarks/wishlist
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Form State for Adding/Editing Ebook
  const [formData, setFormData] = useState({ title: '', description: '', content: '', price: '', genre: 'Fiction', coverImage: '' });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && user.role !== 'writer' && user.role !== 'admin') {
      router.push('/dashboard/user');
    } else if (user) {
      fetchEbooks();
      fetchSales();
      fetchProfile();
    }
  }, [user, authLoading, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProfileData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchEbooks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/ebooks`);
      const data = await res.json();
      if (res.ok) {
        setEbooks(data.ebooks.filter(e => e.writer && e.writer._id === user._id));
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_URL}/api/transactions/sales`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) setSales(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);

    try {
      const imgBBKey = 'bdf33db9b964ffc73bf5404439c279c6';
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgBBKey}`, {
        method: 'POST',
        body: bodyFormData
      });
      const data = await res.json();

      if (data.success) {
        setFormData({ ...formData, coverImage: data.data.url });
        alert('Ebook cover uploaded successfully!');
      } else {
        throw new Error('Image upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload cover image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `${API_URL}/api/ebooks/${editingId}`
        : `${API_URL}/api/ebooks`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert(editingId ? 'Ebook updated!' : 'Ebook created successfully!');
        setFormData({ title: '', description: '', content: '', price: '', genre: 'Fiction', coverImage: '' });
        setEditingId(null);
        setActiveTab('manage');
        fetchEbooks();
      }
    } catch (err) {
      console.error(err);
      alert('Error saving ebook');
    }
  };

  const toggleStatus = async (ebook) => {
    try {
      const newStatus = ebook.status === 'published' ? 'unpublished' : 'published';
      const res = await fetch(`${API_URL}/api/ebooks/${ebook._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        alert(`Ebook successfully ${newStatus}!`);
        fetchEbooks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (ebook) => {
    setFormData({
      title: ebook.title,
      description: ebook.description,
      content: ebook.content || '',
      price: ebook.price,
      genre: ebook.genre,
      coverImage: ebook.coverImage,
      status: ebook.status
    });
    setEditingId(ebook._id);
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this ebook?')) {
      try {
        const res = await fetch(`${API_URL}/api/ebooks/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) fetchEbooks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePurchase = async (ebookId) => {
    try {
      const res = await fetch(`${API_URL}/api/transactions/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
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

  if (authLoading || loading) return <div className={styles.loading}>Loading Writer Dashboard...</div>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <h3>Writer Dashboard</h3>
        <div className={`${styles.navItem} ${activeTab === 'manage' ? styles.active : ''}`} onClick={() => setActiveTab('manage')}>Manage Ebooks</div>
        <div className={`${styles.navItem} ${activeTab === 'add' ? styles.active : ''}`} onClick={() => { setActiveTab('add'); setEditingId(null); setFormData({ title: '', description: '', content: '', price: '', genre: 'Fiction', coverImage: '' }); }}>{editingId ? 'Edit Ebook' : 'Add Ebook'}</div>
        <div className={`${styles.navItem} ${activeTab === 'bookmarks' ? styles.active : ''}`} onClick={() => setActiveTab('bookmarks')}>Bookmarks</div>
        <div className={`${styles.navItem} ${activeTab === 'sales' ? styles.active : ''}`} onClick={() => setActiveTab('sales')}>Sales History</div>
      </div>

      <div className={styles.mainContent}>
        {activeTab === 'manage' && (
          <div>
            <div className={styles.header}><h2>Manage My Ebooks</h2></div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ebooks.map(ebook => (
                    <tr key={ebook._id}>
                      <td>{ebook.title}</td>
                      <td>${ebook.price}</td>
                      <td>
                        <button 
                          onClick={() => toggleStatus(ebook)}
                          className={`${styles.statusToggleBtn} ${ebook.status === 'published' ? styles.badgeSuccess : styles.badgeWarning}`}
                          style={{ border: 'none', cursor: 'pointer', padding: '0.4rem 0.8rem', borderRadius: '20px', fontWeight: 'bold' }}
                          title="Click to toggle status"
                        >
                          {ebook.status} 🔄
                        </button>
                      </td>
                      <td>
                        <button className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginRight: '0.5rem' }} onClick={() => handleEdit(ebook)}>Edit</button>
                        <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => handleDelete(ebook._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div>
            <div className={styles.header}><h2>{editingId ? 'Edit' : 'Add New'} Ebook</h2></div>
            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }} />
              <textarea name="description" placeholder="Synopsis/Description" value={formData.description} onChange={handleInputChange} required rows="3" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}></textarea>
              <textarea name="content" placeholder="Full Content (Book Body)" value={formData.content} onChange={handleInputChange} required rows="6" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}></textarea>
              <input type="number" name="price" placeholder="Price ($)" value={formData.price} onChange={handleInputChange} required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }} />
              <select name="genre" value={formData.genre} onChange={handleInputChange} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}>
                <option value="Fiction">Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Horror">Horror</option>
                <option value="Non-Fiction">Non-Fiction</option>
              </select>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Ebook Cover Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ padding: '0.5rem 0' }} />
                {uploading && <p style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>Uploading cover to imgBB...</p>}
                {formData.coverImage && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img src={formData.coverImage} alt="Cover Preview" style={{ maxHeight: '120px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                    <p style={{ fontSize: '0.8rem', opacity: '0.6', marginTop: '0.2rem' }}>Uploaded URL: {formData.coverImage}</p>
                  </div>
                )}
              </div>

              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{ padding: '1rem', fontWeight: 'bold' }}>{editingId ? 'Update Ebook' : 'Publish Ebook'}</button>
            </form>
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div>
            <div className={styles.header}><h2>Bookmarks</h2></div>
            {profileLoading ? (
              <p>Loading bookmarked ebooks...</p>
            ) : !profileData || profileData.wishlist?.length === 0 ? (
              <p>No bookmarked ebooks.</p>
            ) : (
              <div className={styles.cardGrid}>
                {profileData.wishlist.map(ebook => {
                  const isPurchased = profileData.purchasedEbooks?.some(b => (b._id || b) === ebook._id);
                  const isWriter = ebook.writer === user._id || ebook.writer?._id === user._id;

                  return (
                    <Link href={`/ebook/${ebook._id}`} key={ebook._id}>
                      <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', background: 'var(--card-bg)', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', height: '100%' }}>
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

        {activeTab === 'sales' && (
          <div>
            <div className={styles.header}><h2>Sales History</h2></div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Ebook</th>
                    <th>Buyer</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(sale => (
                    <tr key={sale._id}>
                      <td>{sale.ebook?.title}</td>
                      <td>{sale.user?.fullName}</td>
                      <td>${sale.amount}</td>
                      <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
