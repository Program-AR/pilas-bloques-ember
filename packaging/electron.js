/* jshint node: true */

const { app, BrowserWindow } = require('electron')

function createWindow() {

  // Create the browser window.
  const win = new BrowserWindow()

  win.setMenuBarVisibility(false)
  win.setMenu(null)
  win.setMinimumSize(800, 600)
  win.setSize(1024, 600, true)
  win.maximize()

  // and load the index.html of the app. 
  win.loadURL('file://' + __dirname + '/index.html')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function onReady() {
  createWindow()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})