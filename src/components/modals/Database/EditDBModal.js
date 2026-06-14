import { useState, useEffect } from 'react';

const EditDBModal = ({ isOpen, onClose, onSave, currentDb }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (currentDb) {
      setName(currentDb.name);
      setPassword('');
    }
  }, [currentDb, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      oldName: currentDb.name,
      newName: name,
      password: password,
      engine: currentDb.engine || 'mysql'
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Edit Database</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Project Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            {/* Etiqueta atualizada para refletir a obrigatoriedade */}
            <label style={styles.label}>Root Password (Required)</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...styles.input, fontFamily: 'JetBrains Mono, monospace' }}
            />
          </div>

          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
            <button type="submit" style={styles.submitButton}>Save Changes</button>
          </div>
        </form>
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
    maxWidth: '400px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
  },
  input: {
    backgroundColor: 'var(--bg-base)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: 'var(--accent-primary)',
    color: '#0F172A',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 4px 14px var(--accent-glow)',
  }
};

export default EditDBModal;