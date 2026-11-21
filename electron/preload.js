const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('kioskNative', {
  isKioskApp: true,
  exitApp: () => ipcRenderer.invoke('app-exit'),
  toggleFullscreen: () => ipcRenderer.invoke('app-toggle-fullscreen'),
  minimizeApp: () => ipcRenderer.invoke('app-minimize'),
  exitFullscreen: () => ipcRenderer.invoke('app-exit-fullscreen'),
});
