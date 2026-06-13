import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, projectName }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.title}>Delete Database</h2>
                <p style={styles.subtitle}>
                    Are you sure you want to delete the project <strong style={{ color: 'var(--text-primary)' }}>{projectName}</strong>?
                </p>

                <div style={styles.warningBox}>
                    <div>
                        <strong>Warning:</strong> This action cannot be undone. All containers and associated data volumes will be permanently destroyed.
                    </div>
                </div>

                <div style={styles.footer}>
                    <button type="button" onClick={onClose} style={styles.cancelButton}>
                        Cancel
                    </button>
                    <button type="button" onClick={onConfirm} style={styles.dangerButton}>
                        Yes, delete database
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(11, 17, 32, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '32px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
    },
    title: {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '8px',
        color: 'var(--text-primary)',
    },
    subtitle: {
        fontSize: '14px',
        color: 'var(--text-secondary)',
        marginBottom: '20px',
        lineHeight: '1.5',
    },
    warningBox: {
        display: 'flex',
        gap: '12px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)', // Fundo vermelho muito subtil
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '8px',
        padding: '16px',
        color: 'var(--state-error)',
        fontSize: '13px',
        lineHeight: '1.5',
    },
    warningIcon: {
        fontSize: '16px',
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: '28px',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'background-color 0.2s',
    },
    dangerButton: {
        backgroundColor: 'var(--state-error)',
        color: '#FFFFFF',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
        transition: 'opacity 0.2s',
    }
};

export default DeleteConfirmModal;