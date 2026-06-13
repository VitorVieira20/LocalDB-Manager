const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const os = require('os');

if (process.platform === 'darwin') {
    process.env.PATH = [
        process.env.PATH,
        '/usr/local/bin',
        '/opt/homebrew/bin',
        `${os.homedir()}/.orbstack/bin`,
        '/Applications/Docker.app/Contents/Resources/bin'
    ].join(':');
}

const store = require('./services/store');
const docker = require('./services/docker');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, 'index.html'));
    } else {
        win.loadURL('http://localhost:3000');
    }
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});


ipcMain.on('app:open-browser', (event, url) => shell.openExternal(url));
ipcMain.handle('app:load-data', () => store.loadData());
ipcMain.handle('app:save-data', (event, data) => store.saveData(data));
ipcMain.handle('app:reset', () => store.resetApp());

ipcMain.handle('docker:check', () => docker.checkDocker());
ipcMain.handle('app:sync-status', (event, databases) => docker.syncStatus(databases));

ipcMain.handle('docker:create', async (event, dbData) => {
    try {
        return await docker.setupProject(dbData.name, dbData.password);
    } catch (error) {
        return { success: false, error: error.message };
    }
});
ipcMain.handle('docker:update', (event, data) => docker.updateProject(data.oldName, data.newName, data.password));
ipcMain.handle('docker:start', (event, projectName) => docker.startProject(projectName));
ipcMain.handle('docker:stop', (event, projectName) => docker.stopProject(projectName));
ipcMain.handle('docker:delete', (event, projectName) => docker.deleteProject(projectName));