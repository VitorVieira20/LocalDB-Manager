const Spinner = () => (
    <svg className="animate-spin" style={{ width: 32, height: 32, marginBottom: 16, color: 'var(--accent-primary)' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"></circle>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ResetConfirmModal = ({ isOpen, onClose, onConfirm, isDeleting, progressText }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>

                {isDeleting ? (
                    <div style={styles.loadingContainer}>
                        <Spinner />
                        <h2 style={{ ...styles.title, color: 'var(--text-primary)' }}>Resetting Application</h2>
                        <p style={styles.progressText}>{progressText || 'Please wait...'}</p>
                    </div>
                ) : (
                    <>
                        <h2 style={styles.title}>Hard Reset Warning</h2>
                        <p style={styles.text}>
                            Are you absolutely sure you want to perform a hard reset?
                            This will stop and remove all database containers, delete all associated volumes,
                            and clear your entire project list.
                        </p>
                        <div style={styles.warningBox}>
                            <strong>Warning:</strong> This action cannot be undone.
                        </div>
                        <div style={styles.footer}>
                            <button onClick={onClose} style={styles.cancelButton}>Cancel</button>
                            <button onClick={onConfirm} style={styles.dangerButton}>Yes, Reset Everything</button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 17, 32, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '450px' },
    loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0' },
    title: { fontSize: '20px', fontWeight: '600', color: 'var(--state-error)', marginBottom: '16px', textAlign: 'center' },
    text: { fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' },
    progressText: { fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'monospace', marginTop: '8px' },
    warningBox: { padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--state-error)', borderRadius: '6px', fontSize: '13px', marginBottom: '24px' },
    footer: { display: 'flex', justifyContent: 'flex-end', gap: '12px' },
    cancelButton: { backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
    dangerButton: { backgroundColor: 'var(--state-error)', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }
};

export default ResetConfirmModal;