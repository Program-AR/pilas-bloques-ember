/* jshint node: true */

var electron = require('electron');

var app = electron.app;
var mainWindow = null;
var BrowserWindow = electron.BrowserWindow;


var fs = require('fs');

electron.crashReporter.start();

app.on('window-all-closed', function onWindowAllClosed() {
  app.quit();
});

app.on('ready', function onReady() {

  mainWindow = new BrowserWindow({
    width: 951,
    height: 672,
    minWidth: 500,
    minHeight: 500,
  });

  //mainWindow.openDevTools();

  delete mainWindow.module;

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function onClosed() {
    mainWindow = null;
  });

  /* Detecta cambios y reinicia automáticamente en modo desarrollo */
  if (fs.existsSync(__dirname)) {
    fs.watch(__dirname, {recursive: true}, function() {
      mainWindow.reload();
    });
  }

});
