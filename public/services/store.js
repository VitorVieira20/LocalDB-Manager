const path = require('path');
const fs = require('fs/promises');
const { app } = require('electron');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const getDataFilePath = () => path.join(app.getPath('userData'), 'instances', 'data.json');
const getSettingsFilePath = () => path.join(app.getPath('userData'), 'instances', 'settings.json');

async function loadData() {
    try {
        const fileContent = await fs.readFile(getDataFilePath(), 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

async function saveData(data) {
    try {
        const filePath = getDataFilePath();
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return { success: true };
    } catch (error) {
        console.error('Erro ao guardar data.json:', error);
        return { success: false, error: error.message };
    }
}

async function loadSettings() {
    try {
        const fileContent = await fs.readFile(getSettingsFilePath(), 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return { autoStart: false, mysqlPort: 3306, postgresPort: 5432, mongoPort: 27017 };
    }
}

async function saveSettings(settings) {
    try {
        const filePath = getSettingsFilePath();
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(settings, null, 2));
        return { success: true };
    } catch (error) {
        console.error('Erro ao guardar settings.json:', error);
        return { success: false, error: error.message };
    }
}

async function resetApp() {
    try {
        const instancesPath = path.join(app.getPath('userData'), 'instances');
        const exists = await fs.access(instancesPath).then(() => true).catch(() => false);
        if (!exists) return { success: true };

        const projects = await fs.readdir(instancesPath);

        for (const projectName of projects) {
            const projectDir = path.join(instancesPath, projectName);
            const composePath = path.join(projectDir, 'docker-compose.yml');

            const isDir = (await fs.stat(projectDir)).isDirectory();
            const hasCompose = await fs.access(composePath).then(() => true).catch(() => false);

            if (isDir && hasCompose) {
                try {
                    await execAsync(`docker compose -f "${composePath}" down -v`);
                } catch (e) {
                    console.error(`Erro ao desligar ${projectName}:`, e.message);
                }
            }
        }

        await fs.rm(instancesPath, { recursive: true, force: true });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = { loadData, saveData, resetApp, loadSettings, saveSettings };