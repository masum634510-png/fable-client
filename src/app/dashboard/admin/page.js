'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../Dashboard.module.css';

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
        fetch('http://localhost:5000/api/users', { headers }),
        fetch('http://localhost:5000/api/ebooks'),
        fetch('http://localhost:5000/api/transactions', { headers }),
        fetch('http://localhost:5000/api/transactions/analytics', { headers })
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
      const res = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` 
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEbook = async (id) => {
    if(confirm('Delete ebook globally?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/ebooks/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (authLoading || loading) return <div>Loading Admin dashboard...</div>;

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
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{analytics.totalUsers}</p>
              </div>
              <div style={{ background: 'var(--secondary)', padding: '2rem', borderRadius: '12px' }}>
                <h3>Total Writers</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{analytics.totalWriters}</p>
              </div>
              <div style={{ background: 'var(--secondary)', padding: '2rem', borderRadius: '12px' }}>
                <h3>Ebooks Sold</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{analytics.totalEbooksSold}</p>
              </div>
              <div style={{ background: 'var(--secondary)', padding: '2rem', borderRadius: '12px' }}>
                <h3>Total Revenue</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>${analytics.totalRevenue.toFixed(2)}</p>
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
                          style={{ padding: '0.3rem' }}
                        >
                          <option value="user">User</option>
                          <option value="writer">Writer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                         <button className={`${styles.btn} ${styles.btnDanger}`}>Delete</button>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ebooks.map(ebook => (
                    <tr key={ebook._id}>
                      <td>{ebook.title}</td>
                      <td>{ebook.writer?.fullName}</td>
                      <td>${ebook.price}</td>
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
                      <td>{t.user?.email}</td>
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
