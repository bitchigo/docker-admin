const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  ipcMain,
} = require('electron')
const path = require('path')



function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    
    frame: false,
    
    webSecurity: false,
    allowRunningInsecureContent: true
  })
  Menu.setApplicationMenu(null)
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('close', (event) => {
    mainWindow.hide();
    mainWindow.setSkipTaskbar(true);
    event.preventDefault();
  });
  mainWindow.hide();
  //mainWindow.webContents.openDevTools()


  appIcon = new Tray(path.join(__dirname, 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: '退出',click:()=>{mainWindow.destroy()}},
  ])
  appIcon.setContextMenu(contextMenu);
  appIcon.on('click',()=>{
    mainWindow.isVisible()?mainWindow.hide():mainWindow.show();
    mainWindow.isVisible() ?mainWindow.setSkipTaskbar(false):mainWindow.setSkipTaskbar(true);
    mainWindow.reload();
  })

  ipcMain.on('min', e=> mainWindow.hide(),mainWindow.setSkipTaskbar(false));
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('window-min', function () {
  mainWindow.minimize();
})