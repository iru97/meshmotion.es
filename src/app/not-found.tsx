export default function NotFound() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    }}>
      <div style={{
        padding: '2rem',
        maxWidth: '28rem',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1rem',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            background: 'rgba(59, 130, 246, 0.8)',
            color: 'white',
            fontWeight: '500',
            textDecoration: 'none',
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  )
}
