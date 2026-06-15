import { useEffect, useState } from 'react';

const NewDBModal = ({ isOpen, onClose, onSubmit }) => {
    const [projectName, setProjectName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [engine, setEngine] = useState('mysql');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setProjectName('');
            setPassword('');
            setConfirmPassword('');
            setEngine('mysql');
            setShowPassword(false);
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        onSubmit({ name: projectName, password, engine });
        setProjectName('');
        setPassword('');
        setConfirmPassword('');
        setEngine('mysql');
        setShowPassword(false);
        onClose();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.title}>New Database</h2>
                <p style={styles.subtitle}>Define the details for your new local instance.</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Project Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., my_web_project"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Database Engine</label>
                        <select
                            value={engine}
                            onChange={(e) => setEngine(e.target.value)}
                            style={styles.input}
                        >
                            <option value="mysql">MySQL 8.0</option>
                            <option value="postgres">PostgreSQL 15</option>
                            <option value="mongodb">MongoDB (Latest)</option>
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Root Password (Required)</label>
                        <div style={styles.passwordContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ ...styles.input, ...styles.passwordInput }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.toggleBtn}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ ...styles.input, fontFamily: 'JetBrains Mono, monospace' }}
                        />
                        {error && <span style={styles.errorText}>{error}</span>}
                    </div>

                    <div style={styles.footer}>
                        <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
                        <button type="submit" style={styles.submitButton}>Create Instance</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 17, 32, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)' },
    title: { fontSize: '20px', fontWeight: '600', marginBottom: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' },
    input: { backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px 12px', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' },
    passwordContainer: { position: 'relative', display: 'flex', width: '100%' },
    passwordInput: { width: '100%', boxSizing: 'border-box', paddingRight: '60px', fontFamily: 'JetBrains Mono, monospace' },
    toggleBtn: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px', fontWeight: '600', padding: 0 },
    errorText: { color: '#ef4444', fontSize: '12px', marginTop: '4px' },
    footer: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
    cancelButton: { backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
    submitButton: { backgroundColor: 'var(--accent-primary)', color: '#0F172A', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 14px var(--accent-glow)' }
};

export default NewDBModal;