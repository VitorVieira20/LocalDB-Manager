import { useState, useEffect } from 'react';

export function useDatabases() {
    const [databases, setDatabases] = useState([]);
    const [isDockerRunning, setIsDockerRunning] = useState(true);

    useEffect(() => {
        let interval;

        const initApp = async () => {
            const dockerStatus = await window.dockerAPI.checkDocker();

            if (!dockerStatus.isRunning) {
                setIsDockerRunning(false);
                return;
            }

            const settings = await window.dockerAPI.loadSettings();
            const savedData = await window.dockerAPI.loadData();

            if (savedData.length > 0) {
                if (settings.autoStart) {
                    for (const db of savedData) {
                        await window.dockerAPI.startInstance(db.name);
                    }
                }

                const syncedData = await window.dockerAPI.syncStatus(savedData);
                setDatabases(syncedData);
                await window.dockerAPI.saveData(syncedData);
            } else {
                setDatabases([]);
            }

            interval = setInterval(async () => {
                setDatabases(prevDbs => {
                    if (prevDbs.length > 0) {
                        window.dockerAPI.syncStatus(prevDbs).then(synced => setDatabases(synced));
                    }
                    return prevDbs;
                });
            }, 30000);
        };

        initApp();

        return () => clearInterval(interval);
    }, []);

    const updateAndSaveDatabases = async (newData) => {
        setDatabases(newData);
        await window.dockerAPI.saveData(newData);
    };

    const createDatabase = async (dbData) => {
        try {
            const response = await window.dockerAPI.createInstance(dbData);
            if (response.success) {
                const newDb = {
                    id: Date.now(),
                    name: dbData.name,
                    engine: dbData.engine || 'mysql',
                    status: 'running',
                    dbPort: response.dbPort,
                    uiPort: response.uiPort,
                };
                await updateAndSaveDatabases([...databases, newDb]);
                return true;
            } else {
                alert(`Error creating database:\n\n${response.error}`);
                return false;
            }
        } catch (error) {
            alert('Communication failure with the operating system.');
            return false;
        }
    };

    const toggleStatus = async (id) => {
        const db = databases.find(d => d.id === id);
        if (!db) return;

        const isRunning = db.status === 'running';
        const action = isRunning ? window.dockerAPI.stopInstance : window.dockerAPI.startInstance;

        try {
            const response = await action(db.name);
            if (response.success) {
                const newData = databases.map(d =>
                    d.id === id ? { ...d, status: isRunning ? 'stopped' : 'running' } : d
                );
                await updateAndSaveDatabases(newData);
            } else {
                alert(`Docker error:\n\n${response.error}`);
            }
        } catch (error) {
            alert('Communication failure with the operating system.');
        }
    };

    const updateDatabase = async (updateData) => {
        const response = await window.dockerAPI.updateInstance(updateData);
        if (response.success) {
            const newList = databases.map(db =>
                db.name === updateData.oldName ? {
                    ...db,
                    name: updateData.newName,
                    dbPort: response.dbPort,
                    uiPort: response.uiPort
                } : db
            );
            await updateAndSaveDatabases(newList);
            return true;
        } else {
            alert("Error: " + response.error);
            return false;
        }
    };

    const deleteDatabase = async (id) => {
        const db = databases.find(d => d.id === id);
        if (!db) return;

        try {
            const response = await window.dockerAPI.deleteInstance(db.name);
            if (response.success) {
                const newData = databases.filter(d => d.id !== id);
                await updateAndSaveDatabases(newData);
            } else {
                alert(`Error deleting database:\n\n${response.error}`);
            }
        } catch (error) {
            alert('Communication failure with the operating system.');
        }
    };

    const openPMA = (db) => {
        const port = db.uiPort || db.pmaPort;
        const url = `http://localhost:${port}`;
        window.dockerAPI.openBrowser(url);
    };

    const hardReset = async (onProgress) => {
        for (const db of databases) {
            if (onProgress) onProgress(`Removing project: ${db.name}...`);
            await window.dockerAPI.deleteInstance(db.name);
        }

        if (onProgress) onProgress('Cleaning up system files...');
        const response = await window.dockerAPI.resetApp();

        if (response.success) {
            if (onProgress) onProgress('Done! Reloading...');

            setTimeout(() => {
                setDatabases([]);
                window.location.reload();
            }, 1000);

        } else {
            alert("Error resetting app: " + response.error);
        }
    };

    return {
        databases,
        isDockerRunning,
        createDatabase,
        toggleStatus,
        updateDatabase,
        deleteDatabase,
        openPMA,
        hardReset
    };
}