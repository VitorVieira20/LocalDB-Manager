const { app, BrowserWindow, ipcMain, shell, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

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
let win;
let tray = null;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.on('close', function (event) {
        if (!app.isQuitting) {
            event.preventDefault();
            win.hide();
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

app.on('before-quit', () => app.isQuitting = true);


ipcMain.on('app:open-browser', (event, url) => shell.openExternal(url));
ipcMain.handle('app:load-data', () => store.loadData());
ipcMain.handle('app:save-data', (event, data) => store.saveData(data));
ipcMain.handle('app:reset', () => store.resetApp());

ipcMain.handle('docker:check', () => docker.checkDocker());
ipcMain.handle('app:sync-status', (event, databases) => docker.syncStatus(databases));

ipcMain.handle('docker:create', async (event, dbData) => {
    try {
        return await docker.setupProject(dbData.name, dbData.password, dbData.engine);
    } catch (error) {
        return { success: false, error: error.message };
    }
});
ipcMain.handle('docker:update', (event, data) => docker.updateProject(data.oldName, data.newName, data.password, data.engine));
ipcMain.handle('docker:start', (event, projectName) => docker.startProject(projectName));
ipcMain.handle('docker:stop', (event, projectName) => docker.stopProject(projectName));
ipcMain.handle('docker:delete', (event, projectName) => docker.deleteProject(projectName));

let activeLogStreams = {};

ipcMain.on('docker:logs', (event, containerName) => {
    if (activeLogStreams[containerName]) {
        activeLogStreams[containerName].kill();
    }

    const logStream = spawn('docker', ['logs', '-f', containerName]);
    activeLogStreams[containerName] = logStream;

    logStream.stdout.on('data', (data) => {
        event.sender.send(`logs-data-${containerName}`, data.toString());
    });

    logStream.stderr.on('data', (data) => {
        event.sender.send(`logs-data-${containerName}`, data.toString());
    });

    logStream.on('close', () => {
        delete activeLogStreams[containerName];
    });
});

ipcMain.on('docker:stop-logs', (event, containerName) => {
    if (activeLogStreams[containerName]) {
        activeLogStreams[containerName].kill();
        delete activeLogStreams[containerName];
    }
});

ipcMain.handle('docker:stats', (event, containerName) => docker.getStats(containerName));

ipcMain.on('app:update-tray', (event, databases) => {
    if (!tray) {
        const icon = nativeImage.createEmpty();
        tray = new Tray(icon);
        tray.setTitle('LocalDB');
        tray.setToolTip('LocalDB Manager');
    }

    const template = databases.map(db => ({
        label: `${db.name} (${db.status})`,
        submenu: [
            {
                label: db.status === 'running' ? 'Stop Container' : 'Start Container',
                click: () => win.webContents.send('tray:toggle-db', db.id)
            }
        ]
    }));

    template.push({ type: 'separator' });
    template.push({ label: 'Open Dashboard', click: () => win.show() });
    template.push({
        label: 'Quit', click: () => {
            app.isQuitting = true;
            app.quit();
        }
    });

    tray.setContextMenu(Menu.buildFromTemplate(template));
});

ipcMain.handle('app:load-settings', () => store.loadSettings());
ipcMain.handle('app:save-settings', (event, settings) => store.saveSettings(settings));