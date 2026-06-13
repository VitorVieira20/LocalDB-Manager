const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dockerAPI', {
    createInstance: (dbData) => ipcRenderer.invoke('docker:create', dbData),
    startInstance: (projectName) => ipcRenderer.invoke('docker:start', projectName),
    stopInstance: (projectName) => ipcRenderer.invoke('docker:stop', projectName),
    updateInstance: (projectName) => ipcRenderer.invoke('docker:update', projectName),
    deleteInstance: (projectName) => ipcRenderer.invoke('docker:delete', projectName),
    openBrowser: (url) => ipcRenderer.send('app:open-browser', url),
    loadData: () => ipcRenderer.invoke('app:load-data'),
    saveData: (data) => ipcRenderer.invoke('app:save-data', data),
    syncStatus: (databases) => ipcRenderer.invoke('app:sync-status', databases),
    resetApp: () => ipcRenderer.invoke('app:reset'),
    checkDocker: () => ipcRenderer.invoke('docker:check')
});