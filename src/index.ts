import {app, BrowserView, BrowserWindow} from 'electron';

let mainWindow : BrowserWindow;
let view: BrowserView;

app.on("ready", createWindows);

function createWindows(): void {
    mainWindow = new BrowserWindow({
        width:1200, height:1080,
        webPreferences:{
            preload: __dirname + "/preload.js"
        },
        show: false
    });

    view = new BrowserView();
    mainWindow.setBrowserView(view);
    view.setBounds({ x: 0, y: 0, width: 900, height: 600 })
    view.webContents.loadURL('http://10.85.40.98:3000/')

    mainWindow.loadFile("./index.html");
    mainWindow.on("ready-to-show", () => mainWindow.show());
}
