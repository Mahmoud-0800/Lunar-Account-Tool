import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { AccountManager } from './helpers/AccountManager.js';
import { platform } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

// Get platform-specific icon
const getIconPath = () => {
  const currentPlatform = platform();
  switch (currentPlatform) {
    case 'win32':
      return join(__dirname, 'renderer/icon-win.ico');
    case 'darwin':
      return join(__dirname, 'renderer/icon-mac.icns');
    case 'linux':
      return join(__dirname, 'renderer/icon-deb.png');
    default:
      return join(__dirname, 'renderer/icon-deb.png');
  }
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1160,
    height: 690,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js')
    },
    frame: false,
    titleBarStyle: 'hidden',
    transparent: true,
    show: false,
    icon: getIconPath()
  });

  // Load the HTML file
  mainWindow.loadFile(join(__dirname, 'renderer', 'index.html'));

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
};

// App event listeners
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('window-minimize', () => {
  mainWindow.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle('window-close', () => {
  mainWindow.close();
});

ipcMain.handle('load-accounts', async () => {
  try {
    AccountManager.loadJson();
    return {
      success: true,
      accounts: AccountManager.json?.accounts || {}
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('save-accounts', async () => {
  try {
    AccountManager.saveJson();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('create-account', async (event, { username, uuid }) => {
  try {
    AccountManager.createAccount(username, uuid);
    AccountManager.saveJson();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('remove-all-accounts', async () => {
  try {
    AccountManager.removeAllAccounts();
    AccountManager.saveJson();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('remove-cracked-accounts', async () => {
  try {
    AccountManager.removeCrackedAccounts();
    AccountManager.saveJson();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('remove-premium-accounts', async () => {
  try {
    AccountManager.removePremiumAccounts();
    AccountManager.saveJson();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('validate-username', async (event, username) => {
  const { Validate } = await import('./helpers/Validate.js');
  return Validate.isValidMinecraftUsername(username);
});

ipcMain.handle('validate-uuid', async (event, uuid) => {
  const { Validate } = await import('./helpers/Validate.js');
  return Validate.isValidUUID(uuid);
});

ipcMain.handle('show-error-dialog', async (event, { title, content }) => {
  return dialog.showErrorBox(title, content);
});

ipcMain.handle('show-info-dialog', async (event, { title, content }) => {
  return dialog.showMessageBox(mainWindow, {
    type: 'info',
    title,
    message: content,
    buttons: ['OK']
  });
});

ipcMain.handle('open-external-url', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});
