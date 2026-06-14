import { useState, useEffect, useRef } from 'react';

const ENGINE_CONFIG = {
    mysql: { dbSuffix: 'mysql', uiSuffix: 'pma', dbLabel: 'MySQL Engine', uiLabel: 'phpMyAdmin' },
    postgres: { dbSuffix: 'postgres', uiSuffix: 'pgadmin', dbLabel: 'PostgreSQL Engine', uiLabel: 'pgAdmin' },
    mongodb: { dbSuffix: 'mongodb', uiSuffix: 'mongoexpress', dbLabel: 'MongoDB Engine', uiLabel: 'Mongo Express' }
};

function LogsModal({ isOpen, onClose, db }) {
    const [logs, setLogs] = useState('');
    const [activeTab, setActiveTab] = useState('db');
    const logsEndRef = useRef(null);

    useEffect(() => {
        if (!isOpen || !db) return;

        setLogs('');

        // Descobre qual é o engine atual (com fallback seguro para mysql)
        const engineKey = db.engine || 'mysql';
        const config = ENGINE_CONFIG[engineKey];

        // Constrói o nome do contentor baseado na tab genérica
        const suffix = activeTab === 'db' ? config.dbSuffix : config.uiSuffix;
        const containerName = `localdb_${db.name}_${suffix}`;

        window.dockerAPI.openLogs(containerName);

        const cleanupListener = window.dockerAPI.onLogData(containerName, (newLog) => {
            setLogs((prev) => prev + newLog);
        });

        return () => {
            cleanupListener();
            window.dockerAPI.stopLogs(containerName);
        };
    }, [isOpen, db, activeTab]);

    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [logs]);

    if (!isOpen || !db) return null;

    const engineKey = db.engine || 'mysql';
    const config = ENGINE_CONFIG[engineKey];

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Real-time Logs: {db.name}</h2>
                    <button onClick={onClose} style={styles.closeBtn}>&times;</button>
                </div>

                <div style={styles.tabs}>
                    <button
                        style={activeTab === 'db' ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab('db')}
                    >
                        {config.dbLabel}
                    </button>
                    <button
                        style={activeTab === 'ui' ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab('ui')}
                    >
                        {config.uiLabel}
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