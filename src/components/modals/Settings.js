import { useState, useEffect } from 'react';

const SettingsModal = ({ isOpen, onClose }) => {
    const [settings, setSettings] = useState({
        autoStart: false,
        mysqlPort: 3306,
        postgresPort: 5432,
        mongoPort: 27017
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            window.dockerAPI.loadSettings().then(data => setSettings(data));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        await window.dockerAPI.saveSettings(settings);
        setIsSaving(false);
        onClose();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.title}>Application Settings</h2>
                <p style={styles.subtitle}>Configure default behaviors and port assignments.</p>

                <form onSubmit={handleSave} style={styles.form}>
                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>General</h3>
                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={settings.autoStart}
                                onChange={(e) => setSettings({ ...settings, autoStart: e.target.checked })}
                                style={styles.checkbox}
                            />
                            Start all databases automatically when the app opens
                        </label>
                    </section>

                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>Default Base Ports</h3>
                        <p style={styles.helpText}>New databases will attempt to use these ports first.</p>

                        <div style={styles.portGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>MySQL Base</label>
                                <input
                                    type="number"
                                    value={settings.mysqlPort}
                                    onChange={(e) => setSettings({ ...settings, mysqlPort: e.target.value })}
                                    style={{ ...styles.input, fontFamily: 'JetBrains Mono, monospace' }}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>PostgreSQL Base</label>
                                <input
                                    type="number"
                                    value={settings.postgresPort}
                                    onChange={(e) => setSettings({ ...settings, postgresPort: e.target.value })}
                                    style={{ ...styles.input, fontFamily: 'JetBrains Mono, monospace' }}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>MongoDB Base</label>
                                <input
                                    type="number"
                                    value={settings.mongoPort}
                                    onChange={(e) => setSettings({ ...settings, mongoPort: e.target.value })}
                                    style={{ ...styles.input, fontFamily: 'JetBrains Mono, monospace' }}
                                />
                            </div>
                        </div>
                    </section>

                    <div style={styles.footer}>
                        <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
                        <button type="submit" disabled={isSaving} style={styles.submitButton}>
                            {isSaving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 17, 32, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '560px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' },
    title: { fontSize: '20px', fontWeight: '600', marginBottom: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' },
    form: { display: 'flex', flexDirection: 'column', gap: '24px' },
    section: { display: 'flex', flexDirection: 'column', gap: '12px' },
    sectionTitle: { fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' },
    helpText: { fontSize: '13px', color: 'var(--text-secondary)', margin: 0 },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer' },
    checkbox: { width: '16px', height: '16px', accentColor: 'var(--accent-primary)', cursor: 'pointer' },
    portGrid: { display: 'flex', flexWrap: 'wrap', gap: '12px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1', minWidth: '120px' },
    label: { fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' },
    input: { backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px', borderRadius: '6px', fontSize: '14px', outline: 'none' },
    footer: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' },
    cancelButton: { backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
    submitButton: { backgroundColor: 'var(--accent-primary)', color: '#0F172A', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 14px var(--accent-glow)' }
};

export default SettingsModal;