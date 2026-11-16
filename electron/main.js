const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const http = require('http');
const { fork, spawn } = require('child_process');
const fs = require('fs');
const net = require('net');

let mainWindow = null;
let serverProcess = null;
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Find an available port dynamically
function getAvailablePort(startPort = 3000) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(getAvailablePort(startPort + 1));
    });
  });
}

// Poll local HTTP server until it responds
function waitForServer(url, timeoutMs = 45000) {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(url, (res) => {
        if (res.statusCode && res.statusCode < 500) {
          resolve(true);
        } else {
          retry();
        }
      });
      req.on('error', () => retry());
      req.setTimeout(1500, () => {
        req.abort();
        retry();
      });
    };

    const retry = () => {
      if (Date.now() - startTime > timeoutMs) {
        reject(new Error(`Timed out waiting for server at ${url}`));
      } else {
        setTimeout(check, 400);
      }
    };

    check();
  });
}

// Start Next.js local server
async function startNextServer(port) {
  if (isDev) {
    // In dev mode, wait for externally run or existing dev server
    return null;
  }

  const projectRoot = app.isPackaged 
    ? path.join(process.resourcesPath, 'app') 
    : path.resolve(__dirname, '..');

  const standaloneServer = path.join(projectRoot, '.next', 'standalone', 'server.js');
  const nextCli = path.join(projectRoot, 'node_modules', 'next', 'dist', 'bin', 'next');

  const env = {
    ...process.env,
    PORT: String(port),
    HOSTNAME: '127.0.0.1',
    NODE_ENV: 'production',
  };

  if (fs.existsSync(standaloneServer)) {
    console.log(`[Kiosk] Spawning Next.js standalone server on port ${port}...`);
    return fork(standaloneServer, [], {
      env,
      cwd: path.dirname(standaloneServer),
      stdio: 'inherit',
    });
  } else if (fs.existsSync(nextCli)) {
    console.log(`[Kiosk] Spawning Next.js production server on port ${port}...`);
    return fork(nextCli, ['start', '-p', String(port), '-H', '127.0.0.1'], {
      env,
      cwd: projectRoot,
      stdio: 'inherit',
    });
  } else {
    console.warn('[Kiosk] No local next server binary found; assuming server is running on port', port);
    return null;
  }
}

async function createWindow() {
  const port = isDev ? 3000 : await getAvailablePort(3000);
  const targetUrl = `http://127.0.0.1:${port}`;

  if (!isDev) {
    try {
      serverProcess = await startNextServer(port);
      await waitForServer(targetUrl);
    } catch (err) {
      console.error('[Kiosk] Error starting/connecting to local server:', err);
    }
  }

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    kiosk: !isDev,          // Enable full kiosk mode in production
    fullscreen: !isDev,     // Fullscreen in production
    autoHideMenuBar: true,  // Hide top menu bar
    frame: isDev,           // Borderless in production
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (!isDev) {
      mainWindow.setKiosk(true);
    }
  });

  // Load the application
  mainWindow.loadURL(targetUrl);

  // Register Admin emergency exit shortcut: Ctrl + Shift + Q
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    console.log('[Kiosk] Emergency exit hotkey pressed. Closing application...');
    app.quit();
  });

  // Toggle fullscreen for maintenance: Ctrl + Shift + F
  globalShortcut.register('CommandOrControl+Shift+F', () => {
    if (mainWindow) {
      const isKiosk = mainWindow.isKiosk();
      mainWindow.setKiosk(!isKiosk);
      mainWindow.setFullScreen(!isKiosk);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Clean up processes on exit
function cleanup() {
  globalShortcut.unregisterAll();
  if (serverProcess) {
    try {
      serverProcess.kill('SIGTERM');
    } catch (e) {
      // ignore
    }
    serverProcess = null;
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  cleanup();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  cleanup();
});

// IPC communication handlers
ipcMain.handle('app-exit', () => {
  app.quit();
});

ipcMain.handle('app-toggle-fullscreen', () => {
  if (mainWindow) {
    const isFs = mainWindow.isFullScreen();
    mainWindow.setFullScreen(!isFs);
    return !isFs;
  }
  return false;
});
