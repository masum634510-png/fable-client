import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '7rem', fontWeight: '800', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1' }}>404</div>
      <h2 style={{ fontSize: '2.2rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--foreground)', opacity: 0.7, marginBottom: '2.5rem', maxWidth: '500px', fontSize: '1.1rem', lineHeight: '1.6' }}>
        Oops! The literary journey you've requested seems to be lost in another universe. It might have been unpublished or moved.
      </p>
      <Link href="/" style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1rem 2.5rem', borderRadius: '50px', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)', transition: 'transform 0.2s' }}>
        Back to Home
      </Link>
    </div>
  );
}
