const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>How to use LocalDB Manager</h2>
                    <button onClick={onClose} style={styles.closeIcon}>×</button>
                </div>

                <div style={styles.content}>
                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>1. The Basics</h3>
                        <p style={styles.text}>
                            Every database you create runs in its own isolated Docker container.
                            We currently support <strong>MySQL, PostgreSQL, and MongoDB</strong>.
                            This means there are no port conflicts, and your computer stays perfectly clean.
                        </p>
                        <div style={styles.tipBox}>
                            <strong>Pro Tip:</strong> Your instances start completely empty.
                            Click the UI manager button (phpMyAdmin, pgAdmin, or Mongo Express) to create your specific database tables or collections before connecting your app! Use the <strong>View Logs</strong> button if you need to debug the startup process.
                        </div>
                    </section>

                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>2. Connection Credentials</h3>
                        <ul style={styles.list}>
                            <li><strong>Host:</strong> <code>127.0.0.1</code> or <code>localhost</code></li>
                            <li><strong>Username:</strong> Check the <strong>User</strong> label on your project card (e.g., <code>root</code> or <code>admin@localdb.com</code>).</li>
                            <li><strong>Password:</strong> The password you defined when creating the instance.</li>
                            <li><strong>Port:</strong> The specific <strong>Port</strong> shown on the project card.</li>
                        </ul>
                    </section>

                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>3. Environment Setup (.env)</h3>
                        <p style={styles.text}>Replace <code>&lt;PORT&gt;</code>, <code>&lt;USER&gt;</code>, and <code>&lt;PASSWORD&gt;</code> with your card's details:</p>

                        <div style={styles.codeBlockWrapper}>
                            <span style={styles.codeLabel}>Laravel (MySQL / PostgreSQL)</span>
                            <pre style={styles.codeBlock}>
                                {`DB_CONNECTION=mysql # or pgsql
DB_HOST=127.0.0.1
DB_PORT=<PORT>
DB_DATABASE=my_database_name
DB_USERNAME=<USER>
DB_PASSWORD=<PASSWORD>`}
                            </pre>
                        </div>

                        <div style={styles.codeBlockWrapper}>
                            <span style={styles.codeLabel}>Next.js / Node.js (Prisma URL)</span>
                            <pre style={styles.codeBlock}>
                                {`# MySQL or PostgreSQL
DATABASE_URL="mysql://<USER>:<PASSWORD>@localhost:<PORT>/my_database_name"

# MongoDB
DATABASE_URL="mongodb://<USER>:<PASSWORD>@localhost:<PORT>/my_database?authSource=admin"`}
                            </pre>
                        </div>

                        <div style={styles.codeBlockWrapper}>
                            <span style={styles.codeLabel}>NestJS / Node.js (TypeORM)</span>
                            <pre style={styles.codeBlock}>
                                {`DB_HOST=127.0.0.1
DB_PORT=<PORT>
DB_USERNAME=<USER>
DB_PASSWORD=<PASSWORD>
DB_DATABASE=my_database_name`}
                            </pre>
                        </div>
                    </section>
                </div>

                <div style={styles.footer}>
                    <button onClick={onClose} style={styles.primaryButton}>Got it!</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 17, 32, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid var(--border-color)' },
    title: { fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 },
    closeIcon: { background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '28px', cursor: 'pointer', padding: 0, lineHeight: '1' },
    content: { padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' },
    section: { display: 'flex', flexDirection: 'column', gap: '12px' },
    sectionTitle: { fontSize: '16px', fontWeight: '600', color: 'var(--accent-primary)', margin: 0 },
    text: { fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 },
    tipBox: { backgroundColor: 'rgba(14, 165, 233, 0.1)', borderLeft: '4px solid var(--accent-primary)', padding: '12px 16px', borderRadius: '0 8px 8px 0', fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.5' },
    list: { margin: 0, paddingLeft: '24px', fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' },
    codeBlockWrapper: { display: 'flex', flexDirection: 'column', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' },
    codeLabel: { backgroundColor: 'var(--bg-base)', padding: '6px 12px', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' },
    codeBlock: { backgroundColor: '#090D16', padding: '16px', margin: 0, fontSize: '13px', color: '#A5B4FC', overflowX: 'auto', fontFamily: 'JetBrains Mono, monospace', lineHeight: '1.5' },
    footer: { padding: '24px 32px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' },
    primaryButton: { backgroundColor: 'var(--accent-primary)', color: '#0F172A', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'opacity 0.2s' }
};

export default HelpModal;