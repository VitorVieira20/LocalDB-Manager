const DockerErrorScreen = () => {
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐳</div>
                <h2 style={styles.title}>Docker is not running</h2>
                <p style={{ ...styles.subtitle, marginBottom: '32px' }}>
                    LocalDB Manager requires Docker Desktop (or the Docker Engine) to be running in the background.
                    Please start Docker and try again.
                </p>
                <button
                    style={styles.primaryButton}
                    onClick={() => window.location.reload()}
                >
                    Check Again
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-base)', padding: '32px' },
    card: { backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '48px', maxWidth: '500px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' },
    title: { fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' },
    subtitle: { color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' },
    primaryButton: { backgroundColor: 'var(--accent-primary)', color: '#0F172A', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'opacity 0.2s' },
};

export default DockerErrorScreen;