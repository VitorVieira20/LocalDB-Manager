import { useState, useEffect } from 'react';

function OnboardingScreen({ onComplete }) {
    const [step, setStep] = useState(1);
    const [dockerStatus, setDockerStatus] = useState('checking');

    const checkSystem = async () => {
        setDockerStatus('checking');
        setTimeout(async () => {
            const status = await window.dockerAPI.checkDocker();
            setDockerStatus(status.isRunning ? 'running' : 'error');
        }, 1000);
    };

    useEffect(() => {
        if (step === 1) {
            checkSystem();
        }
    }, [step]);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.stepsIndicator}>
                    <div style={step >= 1 ? styles.dotActive : styles.dot}></div>
                    <div style={step >= 2 ? styles.dotActive : styles.dot}></div>
                    <div style={step >= 3 ? styles.dotActive : styles.dot}></div>
                </div>

                {step === 1 && (
                    <div style={styles.content}>
                        <h2 style={styles.title}>Welcome to LocalDB Manager</h2>
                        <p style={styles.subtitle}>Let's check if your system is ready.</p>

                        <div style={styles.checkBox}>
                            <div style={styles.checkRow}>
                                <span style={styles.checkText}>Container Engine (Docker/OrbStack)</span>
                                {dockerStatus === 'checking' && <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Checking...</span>}
                                {dockerStatus === 'running' && <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold' }}>Running</span>}
                                {dockerStatus === 'error' && <span style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 'bold' }}>Not Found</span>}
                            </div>

                            {dockerStatus === 'error' && (
                                <div style={styles.errorAlert}>
                                    <p>We couldn't detect a running container engine.</p>
                                    <p>Please start <b>Docker Desktop</b> or <b>OrbStack</b> and try again.</p>
                                </div>
                            )}
                        </div>

                        <div style={styles.footer}>
                            {dockerStatus === 'error' ? (
                                <button style={styles.primaryBtn} onClick={checkSystem}>Try Again</button>
                            ) : (
                                <button
                                    style={dockerStatus === 'checking' ? styles.disabledBtn : styles.primaryBtn}
                                    disabled={dockerStatus === 'checking'}
                                    onClick={() => setStep(2)}
                                >
                                    Continue
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div style={styles.content}>
                        <h2 style={styles.title}>How it works</h2>
                        <div style={styles.featuresList}>
                            <div style={styles.featureItem}>
                                <span style={styles.featureIcon}>01.</span>
                                <div>
                                    <h4 style={styles.featureTitle}>Isolated Environments</h4>
                                    <p style={styles.featureDesc}>Every database you create runs in its own dedicated Docker container. Your computer stays perfectly clean.</p>
                                </div>
                            </div>
                            <div style={styles.featureItem}>
                                <span style={styles.featureIcon}>02.</span>
                                <div>
                                    <h4 style={styles.featureTitle}>Zero Port Conflicts</h4>
                                    <p style={styles.featureDesc}>Forget the classic "port 3306 is already in use". We automatically assign free ports for every project.</p>
                                </div>
                            </div>
                            <div style={styles.featureItem}>
                                <span style={styles.featureIcon}>03.</span>
                                <div>
                                    <h4 style={styles.featureTitle}>Built-in Tools</h4>
                                    <p style={styles.featureDesc}>Every database comes with an integrated phpMyAdmin instance ready to use with a single click.</p>
                                </div>
                            </div>
                        </div>

                        <div style={styles.footer}>
                            <button style={styles.secondaryBtn} onClick={() => setStep(1)}>Back</button>
                            <button style={styles.primaryBtn} onClick={() => setStep(3)}>Next</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div style={styles.content}>
                        <h2 style={styles.title}>You are all set.</h2>
                        <p style={styles.subtitle}>Your environment is perfectly configured.</p>

                        <div style={styles.readyBox}>
                            <p>Click the <b>"+ New Database"</b> button on the next screen to create your first local database environment.</p>
                        </div>

                        <div style={styles.footer}>
                            <button style={styles.secondaryBtn} onClick={() => setStep(2)}>Back</button>
                            <button style={styles.successBtn} onClick={onComplete}>Let's Go</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0F172A', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
    card: { backgroundColor: 'var(--bg-surface)', width: '500px', maxWidth: '90%', borderRadius: '16px', padding: '32px', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
    stepsIndicator: { display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' },
    dot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--border-color)' },
    dotActive: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', boxShadow: '0 0 8px var(--accent-primary)' },
    content: { display: 'flex', flexDirection: 'column', gap: '16px' },
    title: { margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)', textAlign: 'center' },
    subtitle: { margin: 0, color: 'var(--text-secondary)', textAlign: 'center', fontSize: '1rem' },
    checkBox: { backgroundColor: '#0f111a', padding: '20px', borderRadius: '12px', border: '1px solid #1f2233', marginTop: '16px' },
    checkRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.1rem', fontWeight: '500' },
    errorAlert: { marginTop: '16px', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.9rem', textAlign: 'center' },
    featuresList: { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' },
    featureItem: { display: 'flex', gap: '16px', alignItems: 'flex-start' },
    featureIcon: { fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-primary)', minWidth: '28px' },
    featureTitle: { margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--text-primary)' },
    featureDesc: { margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' },
    readyBox: { backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '24px', borderRadius: '12px', textAlign: 'center', color: '#bae6fd', marginTop: '16px', lineHeight: '1.5' },
    footer: { display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '32px' },
    primaryBtn: { backgroundColor: 'var(--accent-primary)', color: '#0F172A', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', flex: 1 },
    disabledBtn: { backgroundColor: 'var(--border-color)', color: 'var(--text-secondary)', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'not-allowed', flex: 1 },
    secondaryBtn: { backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', flex: 1 },
    successBtn: { backgroundColor: '#10b981', color: '#0F172A', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', flex: 1 }
};

export default OnboardingScreen;