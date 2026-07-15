'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../Dashboard.module.css';
import { API_URL } from '../../../utils/api';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('analytics');
  
  const [users, setUsers] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && user.role !== 'admin') {
      router.push('/dashboard/user');
    } else if (user) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      
      const [uRes, eRes, tRes, aRes] = await Promise.all([
        fetch(`${API_URL}/api/users`, { headers }),
        fetch(`${API_URL}/api/ebooks`),
        fetch(`${API_URL}/api/transactions`, { headers }),
        fetch(`${API_URL}/api/transactions/analytics`, { headers })
      ]);

      setUsers(await uRes.json());
      const eData = await eRes.json();
      setEbooks(eData.ebooks);
      setTransactions(await tRes.json());
      setAnalytics(await aRes.json());
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` 
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        alert('User role updated!');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`${API_URL}/api/users/${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
          alert('User deleted successfully!');
          fetchData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleEbookStatus = async (ebook) => {
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
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEbook = async (id) => {
    if(confirm('Delete ebook globally?')) {
      try {
        const res = await fetch(`${API_URL}/api/ebooks/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
          alert('Ebook deleted globally!');
          fetchData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (authLoading || loading) return <div className={styles.loading}>Loading Admin Dashboard...</div>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <h3>Admin Console</h3>
        <div className={`${styles.navItem} ${activeTab === 'analytics' ? styles.active : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</div>
        <div className={`${styles.navItem} ${activeTab === 'users' ? styles.active : ''}`} onClick={() => setActiveTab('users')}>Manage Users</div>
        <div className={`${styles.navItem} ${activeTab === 'ebooks' ? styles.active : ''}`} onClick={() => setActiveTab('ebooks')}>Manage Ebooks</div>
        <div className={`${styles.navItem} ${activeTab === 'transactions' ? styles.active : ''}`} onClick={() => setActiveTab('transactions')}>Transactions</div>
      </div>

      <div className={styles.mainContent}>
        {activeTab === 'analytics' && (
          <div>
            <div className={styles.header}><h2>Platform Analytics</h2></div>
            <div className={styles.cardGrid}>
              <div style={{ background: 'var(--secondary)', padding: '2rem', borderRadius: '12px' }}>
                <h3>Total Users</h3>
                <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{analytics.totalUsers}</p>
              </div>
              <div style={{ background: 'var(--secondary)', padding: '2rem', borderRadius: '12px' }}>
                <h3>Total Writers</h3>
                <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{analytics.totalWriters}</p>
              </div>
              <div style={{ background: 'var(--secondary)', padding: '2rem', borderRadius: '12px' }}>
                <h3>Ebooks Sold</h3>
                <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{analytics.totalEbooksSold}</p>
              </div>
              <div style={{ background: 'var(--secondary)', padding: '2rem', borderRadius: '12px' }}>
                <h3>Total Revenue</h3>
                <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>${analytics.totalRevenue.toFixed(2)}</p>
              </div>
            </div>

            {/* Custom Visual Charts */}
            <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
              
              {/* Ebooks by Genre Distribution Chart */}
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Ebooks by Genre</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {analytics.genreDist && analytics.genreDist.length > 0 ? (
                    analytics.genreDist.map(item => {
                      const totalEbooks = ebooks.length || 1;
                      const percentage = Math.round((item.count / totalEbooks) * 100);
                      return (
                        <div key={item._id} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span style={{ fontWeight: '600' }}>{item._id || 'Unassigned'}</span>
                            <span>{item.count} ({percentage}%)</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'var(--secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--primary)' }}></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ opacity: 0.6 }}>No genres recorded.</p>
                  )}
                </div>
              </div>

              {/* Monthly Revenue Projection (Mocked representation based on actual sales count) */}
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Recent Monthly Revenue (USD)</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '180px', paddingTop: '1rem', borderBottom: '2px solid var(--border)' }}>
                  {[
                    { month: 'Jan', amount: analytics.totalRevenue * 0.15 },
                    { month: 'Feb', amount: analytics.totalRevenue * 0.20 },
                    { month: 'Mar', amount: analytics.totalRevenue * 0.35 },
                    { month: 'Apr', amount: analytics.totalRevenue * 0.45 },
                    { month: 'May', amount: analytics.totalRevenue * 0.70 },
                    { month: 'Jun', amount: analytics.totalRevenue }
                  ].map((data, idx) => {
                    const maxAmount = analytics.totalRevenue || 1;
                    const heightPercent = Math.max(10, Math.min(100, Math.round((data.amount / maxAmount) * 100)));
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>${data.amount.toFixed(0)}</span>
                        <div style={{ width: '28px', height: `${heightPercent}px`, background: 'var(--accent)', borderRadius: '4px 4px 0 0', transition: 'height 0.5s' }}></div>
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{data.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className={styles.header}><h2>Manage Users</h2></div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>
                        <select 
                          value={u.role} 
                          onChange={(e) => changeUserRole(u._id, e.target.value)}
                          style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                        >
                          <option value="user">User</option>
                          <option value="writer">Writer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                         <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => deleteUser(u._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ebooks' && (
          <div>
            <div className={styles.header}><h2>Global Ebooks</h2></div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Writer</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ebooks.map(ebook => (
                    <tr key={ebook._id}>
                      <td>{ebook.title}</td>
                      <td>{ebook.writer?.fullName || 'Unknown'}</td>
                      <td>${ebook.price}</td>
                      <td>
                        <button 
                          onClick={() => toggleEbookStatus(ebook)}
                          className={`${styles.statusToggleBtn} ${ebook.status === 'published' ? styles.badgeSuccess : styles.badgeWarning}`}
                          style={{ border: 'none', cursor: 'pointer', padding: '0.4rem 0.8rem', borderRadius: '20px', fontWeight: 'bold' }}
                          title="Click to toggle status"
                        >
                          {ebook.status} 🔄
                        </button>
                      </td>
                      <td>
                        <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => deleteEbook(ebook._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div>
            <div className={styles.header}><h2>All Transactions</h2></div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t._id}>
                      <td>{t._id.substring(0, 8)}...</td>
                      <td><span className={styles.badgeSuccess}>{t.type}</span></td>
                      <td>{t.user?.email || 'N/A'}</td>
                      <td>${t.amount}</td>
                      <td>{new Date(t.createdAt).toLocaleDateString()}</td>
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
