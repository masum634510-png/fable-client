'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../Dashboard.module.css';

export default function WriterDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('manage');
  
  const [ebooks, setEbooks] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State for Adding/Editing Ebook
  const [formData, setFormData] = useState({ title: '', description: '', content: '', price: '', genre: 'Fiction', coverImage: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && user.role !== 'writer' && user.role !== 'admin') {
      router.push('/dashboard/user');
    } else if (user) {
      fetchEbooks();
      fetchSales();
    }
  }, [user, authLoading, router]);

  const fetchEbooks = async () => {
    try {
      // Fetch ebooks by this writer. Since public API doesn't filter by writer by default unless added to backend
      // Wait, getEbooks takes generic filters. We can just use it or rely on the backend.
      // To save time, just fetch all and filter client side (not ideal but works for demo)
      const res = await fetch(`http://localhost:5000/api/ebooks`);
      const data = await res.json();
      if (res.ok) {
        setEbooks(data.ebooks.filter(e => e.writer._id === user._id));
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/transactions/sales', {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `http://localhost:5000/api/ebooks/${editingId}`
        : `http://localhost:5000/api/ebooks`;
      
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
        alert(editingId ? 'Ebook updated!' : 'Ebook created!');
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

  const handleEdit = (ebook) => {
    setFormData({
      title: ebook.title,
      description: ebook.description,
      content: ebook.content || '',
      price: ebook.price,
      genre: ebook.genre,
      coverImage: ebook.coverImage
    });
    setEditingId(ebook._id);
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this ebook?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/ebooks/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) fetchEbooks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (authLoading || loading) return <div>Loading dashboard...</div>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <h3>Writer Dashboard</h3>
        <div className={`${styles.navItem} ${activeTab === 'manage' ? styles.active : ''}`} onClick={() => setActiveTab('manage')}>Manage Ebooks</div>
        <div className={`${styles.navItem} ${activeTab === 'add' ? styles.active : ''}`} onClick={() => { setActiveTab('add'); setEditingId(null); setFormData({ title: '', description: '', content: '', price: '', genre: 'Fiction', coverImage: '' }); }}>{editingId ? 'Edit Ebook' : 'Add Ebook'}</div>
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
                        <span className={`${styles.badge} ${ebook.status === 'published' ? styles.badgeSuccess : styles.badgeWarning}`}>
                          {ebook.status}
                        </span>
                      </td>
                      <td>
                        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleEdit(ebook)}>Edit</button>
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
            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required style={{ padding: '0.8rem' }} />
              <textarea name="description" placeholder="Synopsis/Description" value={formData.description} onChange={handleInputChange} required rows="3" style={{ padding: '0.8rem' }}></textarea>
              <textarea name="content" placeholder="Full Content (Book Body)" value={formData.content} onChange={handleInputChange} required rows="6" style={{ padding: '0.8rem' }}></textarea>
              <input type="number" name="price" placeholder="Price ($)" value={formData.price} onChange={handleInputChange} required style={{ padding: '0.8rem' }} />
              <select name="genre" value={formData.genre} onChange={handleInputChange} style={{ padding: '0.8rem' }}>
                <option value="Fiction">Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Sci-Fi">Sci-Fi</option>
              </select>
              <input type="url" name="coverImage" placeholder="Cover Image URL (e.g. from ImgBB)" value={formData.coverImage} onChange={handleInputChange} required style={{ padding: '0.8rem' }} />
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{ padding: '1rem' }}>{editingId ? 'Update' : 'Publish'}</button>
            </form>
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
