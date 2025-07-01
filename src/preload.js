const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),

  // Account management
  loadAccounts: () => ipcRenderer.invoke('load-accounts'),
  saveAccounts: () => ipcRenderer.invoke('save-accounts'),
  createAccount: (data) => ipcRenderer.invoke('create-account', data),
  removeAllAccounts: () => ipcRenderer.invoke('remove-all-accounts'),
  removeCrackedAccounts: () => ipcRenderer.invoke('remove-cracked-accounts'),
  removePremiumAccounts: () => ipcRenderer.invoke('remove-premium-accounts'),

  // Validation
  validateUsername: (username) => ipcRenderer.invoke('validate-username', username),
  validateUUID: (uuid) => ipcRenderer.invoke('validate-uuid', uuid),

  // Dialogs
  showErrorDialog: (data) => ipcRenderer.invoke('show-error-dialog', data),
  showInfoDialog: (data) => ipcRenderer.invoke('show-info-dialog', data),

  // External links
  openExternalUrl: (url) => ipcRenderer.invoke('open-external-url', url)
});
