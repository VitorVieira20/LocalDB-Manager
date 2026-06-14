import { useState } from 'react';
import DeleteConfirmModal from './modals/Database/DeleteConfirmModal';

const Spinner = () => (
    <svg className="animate-spin" style={{ width: 14, height: 14, marginRight: 6 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"></circle>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const DatabaseCard = ({ db, onToggleStatus, onDelete, onOpenPMA, onEdit, onOpenLogs }) => {
    const [loadingAction, setLoadingAction] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const isRunning = db.status === 'running';

    const handleToggle = async () => {
        setLoadingAction('toggle');
        await onToggleStatus(db.id);
        setLoadingAction(null);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleteModalOpen(false);
        setLoadingAction('delete');
        await onDelete(db.id);
    };

    let statusColor = isRunning ? 'var(--state-running)' : 'var(--state-stopped)';
    let boxShadow = isRunning ? '0 0 8px var(--state-running)' : 'none';

    if (loadingAction) {
        statusColor = 'var(--state-warning)';
        boxShadow = '0 0 8px var(--state-warning)';
    }

    const isBusy = loadingAction !== null;

    return (
        <>
            <div style={styles.card}>
                <div style={styles.infoGroup}>
                    <div
                        style={{ ...styles.statusDot, backgroundColor: statusColor, boxShadow }}
                        title={loadingAction ? "Processing..." : (isRunning ? "Running" : "Stopped")}
                    />
                    <div>
                        <h3 style={styles.name}>{db.name}</h3>
                        <div style={styles.portsGroup}>
                            <span className="mono" style={styles.port}>MySQL: {db.mysqlPort}</span>
                            <span style={styles.divider}>|</span>
                            <span className="mono" style={styles.port}>PMA: {db.pmaPort}</span>
                        </div>
                    </div>
                </div>

                <div style={styles.actionGroup}>
                    <button
                        onClick={() => onOpenPMA(db)}
                        disabled={!isRunning || isBusy}
                        style={{
                            ...styles.pmaButton,
                            ...((!isRunning || isBusy) ? styles.buttonDisabled : {})
                        }}
                    >
                        Open phpMyAdmin
                    </button>

                    <button
                        onClick={handleToggle}
                        disabled={isBusy}
                        style={{ ...styles.secondaryButton, ...(isBusy ? styles.buttonDisabled : {}) }}
                    >
                        <div style={styles.btnContent}>
                            {loadingAction === 'toggle' && <Spinner />}
                            {loadingAction === 'toggle'
                                ? (isRunning ? 'Stopping...' : 'Starting...')
                                : (isRunning ? 'Stop' : 'Start')
                            }
                        </div>
                    </button>

                    <button
                        onClick={() => onEdit(db)}
                        disabled={isBusy}
                        style={{ ...styles.secondaryButton, ...(isBusy ? styles.buttonDisabled : {}) }}
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => onOpenLogs(db.name)}
                        style={styles.logsBtn}
                    >
                        View Logs
                    </button>

                    <button
                        onClick={handleDeleteClick}
                        disabled={isBusy}
                        style={{ ...styles.dangerButton, ...(isBusy ? styles.buttonDisabled : {}) }}
                    >
                        <div style={styles.btnContent}>
                            {loadingAction === 'delete' && <Spinner />}
                            {loadingAction === 'delete' ? 'Deleting...' : 'Delete'}
                        </div>
                    </button>
                </div>
            </div>

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                projectName={db.name}
            />
        </>
    );
};

const styles = {
    card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px' },
    infoGroup: { display: 'flex', alignItems: 'center', gap: '16px' },
    statusDot: { width: '10px', height: '10px', borderRadius: '50%', transition: 'all 0.3s ease' },
    name: { fontSize: '16px', fontWeight: '600', marginBottom: '4px' },
    portsGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
    port: { fontSize: '12px', color: 'var(--text-secondary)' },
    divider: { color: 'var(--border-color)', fontSize: '12px' },
    actionGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
    pmaButton: { backgroundColor: 'transparent', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px', transition: 'all 0.2s' },
    secondaryButton: { backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px', transition: 'all 0.2s' },
    dangerButton: { backgroundColor: 'transparent', color: 'var(--state-error)', border: '1px solid transparent', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px', transition: 'all 0.2s' },
    buttonDisabled: { opacity: 0.3, cursor: 'not-allowed', borderColor: 'var(--border-color)' },
    btnContent: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    logsBtn: { backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }
};

export default DatabaseCard;