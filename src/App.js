import React, { useState } from 'react';
import { useDatabases } from './hooks/useDatabases';
import DockerErrorScreen from './components/layout/DockerErrorScreen';
import DatabaseCard from './components/DatabaseCard';
import NewDBModal from './components/modals/Database/NewDBModal';
import EditDBModal from './components/modals/Database/EditDBModal';
import ResetConfirmModal from './components/modals/ResetConfirm';
import HelpModal from './components/modals/Help';
import LogsModal from './components/modals/Logs';
import OnboardingScreen from './components/layout/OnboardingScreen';

function App() {
  const {
    databases,
    isDockerRunning,
    createDatabase,
    toggleStatus,
    updateDatabase,
    deleteDatabase,
    openPMA,
    hardReset
  } = useDatabases();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dbToEdit, setDbToEdit] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetProgress, setResetProgress] = useState('');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [dbForLogs, setDbForLogs] = useState(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(
    localStorage.getItem('hasSeenOnboarding') === 'true'
  );

  if (!hasSeenOnboarding) {
    return (
      <OnboardingScreen
        onComplete={() => {
          localStorage.setItem('hasSeenOnboarding', 'true');
          setHasSeenOnboarding(true);
        }}
      />
    );
  }

  if (!isDockerRunning) {
    return <DockerErrorScreen />;
  }

  const handleEditClick = (db) => {
    setDbToEdit(db);
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = async (data) => {
    const success = await createDatabase(data);
    if (success) setIsModalOpen(false);
  };

  const handleUpdateSubmit = async (data) => {
    const success = await updateDatabase(data);
    if (success) {
      setIsEditModalOpen(false);
      setDbToEdit(null);
    }
  };

  const handleConfirmReset = async () => {
    setIsResetting(true);
    await hardReset((message) => setResetProgress(message));
  };

  const handleOpenLogs = (db) => {
    setDbForLogs(db);
    setIsLogsModalOpen(true);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>LocalDB Manager</h1>
          <p style={styles.subtitle}>Your local environment, simplified.</p>
        </div>
        <div style={styles.buttonGroup}>
          <button onClick={() => setIsHelpModalOpen(true)} style={styles.helpButton}>
            Help & Docs
          </button>
          <button style={styles.primaryButton} onClick={() => setIsModalOpen(true)}>
            + New Database
          </button>
          <button onClick={() => setIsResetModalOpen(true)} style={styles.resetButton}>
            Hard Reset
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {databases.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>No databases running.</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
              Click the button above to create your first MySQL environment.
            </p>
          </div>
        ) : (
          <div style={styles.list}>
            {databases.map(db => (
              <DatabaseCard
                key={db.id}
                db={db}
                onToggleStatus={toggleStatus}
                onDelete={deleteDatabase}
                onOpenPMA={openPMA}
                onEdit={handleEditClick}
                onOpenLogs={handleOpenLogs}
              />
            ))}
          </div>
        )}
      </main>

      <NewDBModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <EditDBModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateSubmit}
        currentDb={dbToEdit}
      />

      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => !isResetting && setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        isDeleting={isResetting}
        progressText={resetProgress}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <LogsModal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
        db={dbForLogs}
      />
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', padding: '32px' },
  header: { display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' },
  buttonGroup: { display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' },
  title: { fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' },
  subtitle: { color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' },
  primaryButton: { backgroundColor: 'var(--accent-primary)', color: '#0F172A', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'opacity 0.2s' },
  main: { flex: 1, overflowY: 'auto' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', backgroundColor: 'var(--bg-surface)', border: '2px dashed var(--border-color)', borderRadius: '12px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  resetButton: { backgroundColor: 'transparent', color: 'var(--state-error)', border: '1px solid var(--state-error)', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  helpButton: { backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' },
};

export default App;