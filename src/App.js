import React, { useState } from 'react';

function App() {
  // Estado temporário para simularmos as bases de dados. Mais tarde virão do Docker.
  const [databases, setDatabases] = useState([]);

  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>LocalDB Manager</h1>
          <p style={styles.subtitle}>O teu ambiente local, simplificado.</p>
        </div>
        <button style={styles.primaryButton}>
          + Nova Base de Dados
        </button>
      </header>

      {/* Área Principal */}
      <main style={styles.main}>
        {databases.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
              Nenhuma instância a correr.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
              Clica no botão acima para criares o teu primeiro ambiente MySQL.
            </p>
          </div>
        ) : (
          <div style={styles.list}>
            {/* Os cards das bases de dados vão aparecer aqui */}
          </div>
        )}
      </main>
    </div>
  );
}

// Estilos em JavaScript utilizando as variáveis CSS criadas no passo anterior
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: '32px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid var(--border-color)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    marginTop: '6px',
  },
  primaryButton: {
    backgroundColor: 'var(--accent-primary)',
    color: '#0F172A', // Sempre escuro para contraste com o azul ciano
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 14px var(--accent-glow)',
    transition: 'all 0.2s ease',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    backgroundColor: 'var(--bg-surface)',
    border: '2px dashed var(--border-color)',
    borderRadius: '12px',
  }
};

export default App;