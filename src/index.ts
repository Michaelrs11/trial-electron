// Modules to control application life and create native browser window
import { app, BrowserWindow, BrowserView, ipcMain, shell, dialog } from 'electron';
import path from 'path';

let mainWindow : BrowserWindow;
let view: BrowserView;

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('tls-printing', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
    app.setAsDefaultProtocolClient('tls-printing')
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    
  })

  // Create mainWindow, load the rest of the app, etc...
  app.whenReady().then(() => {
    createWindow()
  })
  
  app.on('open-url', (event, url) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
  })
}

function createWindow () : void {
        mainWindow = new BrowserWindow({
        width:1200, height:1080,
        webPreferences:{
        preload: __dirname + "/preload.js"
    },
        show: false,
        //titleBarStyle: 'hidden',
        //frame: false
    });
    
    view = new BrowserView();
    mainWindow.setBrowserView(view);
    view.setBounds({ x: 0, y: 0, width: 1200, height: 600 })
    view.webContents.loadURL('http://localhost:31776/')
    
    mainWindow.loadFile("./index.html");
    mainWindow.on("ready-to-show", () => mainWindow.show());
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// Handle window controls via IPC
ipcMain.on('shell:open', () => {
  const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked')
  const pagePath = path.join('file://', pageDirectory, 'index.html')
  shell.openExternal(pagePath)
})