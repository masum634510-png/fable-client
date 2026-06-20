import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px' }}>
        The ebook or page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link href="/" style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 'bold' }}>
        Return to Home
      </Link>
    </div>
  );
}
