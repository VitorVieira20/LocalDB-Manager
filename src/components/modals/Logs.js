import { useState, useEffect, useRef } from 'react';

function LogsModal({ isOpen, onClose, dbName }) {
    const [logs, setLogs] = useState('');
    const [activeTab, setActiveTab] = useState('mysql');
    const logsEndRef = useRef(null);

    useEffect(() => {
        if (!isOpen || !dbName) return;

        setLogs('');

        const containerName = `localdb_${dbName}_${activeTab}`;

        window.dockerAPI.openLogs(containerName);

        const cleanupListener = window.dockerAPI.onLogData(containerName, (newLog) => {
            setLogs((prev) => prev + newLog);
        });

        return () => {
            cleanupListener();
            window.dockerAPI.stopLogs(containerName);
        };
    }, [isOpen, dbName, activeTab]);

    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [logs]);

    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Real-time Logs: {dbName}</h2>
                    <button onClick={onClose} style={styles.closeBtn}>&times;</button>
                </div>

                <div style={styles.tabs}>
                    <button
                        style={activeTab === 'mysql' ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab('mysql')}
                    >
                        MySQL Engine
                    </button>
                    <button
                        style={activeTab === 'pma' ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab('pma')}
                    >
                        phpMyAdmin
                    </button>
                </div>

                <div style={styles.terminal}>
                    <pre style={styles.code}>{logs || 'Waiting for logs...'}</pre>
                    <div ref={logsEndRef} />
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: '12px', width: '800px', maxWidth: '90%', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--border-color)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' },
    closeBtn: { background: 'none', border: 'none', fontSize: '24px', color: 'var(--text-secondary)', cursor: 'pointer' },
    tabs: { display: 'flex', gap: '8px' },
    tab: { padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer' },
    activeTab: { padding: '8px 16px', backgroundColor: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', color: '#0F172A', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    terminal: { backgroundColor: '#0f111a', padding: '16px', borderRadius: '8px', height: '400px', overflowY: 'auto', border: '1px solid #1f2233' },
    code: { color: '#a6accd', fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }
};

export default LogsModal;