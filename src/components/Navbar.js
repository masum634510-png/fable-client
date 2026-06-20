'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Fable</Link>
      </div>
      <ul className={styles.navLinks}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/browse">Browse Ebooks</Link></li>
        {user ? (
          <>
            <li>
              <Link href={`/dashboard/${user.role}`}>Dashboard</Link>
            </li>
            <li>
              <button onClick={logout} className={styles.logoutBtn}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register" className={styles.registerBtn}>Register</Link></li>
          </>
        )}
        <li><ThemeToggle /></li>
      </ul>
    </nav>
  );
}
