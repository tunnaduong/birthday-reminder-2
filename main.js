'use strict';
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const os = require('os'); 
const JSFtp = require("jsftp");
const path = require('path');
const http = require('http');
const ipcMain = require('electron').ipcMain;
const Tray = electron.Tray;
const fs = require('fs');
const Ftp = require('./ftp-details');
// Report crashes to our server.
electron.crashReporter.start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1620, 
    height: 860,
    icon: 'img/logo-gold.png',
    autoHideMenuBar: true
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);
	global.sharedObject = os.cpus();
	global.osInfo = os.platform();
	console.log(os.cpus());
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  // const appIcon = new Tray('/img/logo-gold.png');
  http.get('http://www.maxnathaniel.com/bday/main.json', (res) => {
    let bdayArray = '';
    let bday = [];
    res.on('data', (chunk) => {
      console.log(chunk);
      bdayArray += chunk;
    });
    res.on('end', () => {
      console.log('no more data');
      bday = JSON.parse(bdayArray);
      mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.webContents.send('ping', bday.birthday);
      });
    });
  });
  ipcMain.on('form-inputs', function(event, arg) {
    console.log(arg);
    mainWindow.webContents.on('did-finish-load', function() {
      mainWindow.webContents.send('mainObj', arg);
    });
  });
  ipcMain.on('inputs-form', function(event, arg) {
    console.log(arg);
    http.get('http://www.maxnathaniel.com/bday/main.json', (res) => {
      let bdayArray = '';
      let bday = [];
      res.on('data', (chunk) => {
        bdayArray += chunk;
      });
      res.on('end', () => {
      bday = JSON.parse(bdayArray);
      bday.birthday.push(arg);
      console.log('new birthday array');
      console.log(bday.birthday);
      console.log('JSONobj');
      let JSONobj = {birthday: []}
      bday.birthday.forEach(function(el) {
        JSONobj.birthday.push(el);
      })
      console.log(JSONobj);
    
      fs.writeFile('temp/birthdayList.json', JSON.stringify(JSONobj), function (err) {
        if (err) {
          return console.log(err);
        }
      });    
      Ftp.put('temp/birthdayList.json', '/public_html/bday/main.json', function(error) {
        if(!error) {
          console.log('file transferred!');
        }
        if(error) {
          console.log(error);
        }
      });
        event.sender.send('ping', bday.birthday);
      });
    });

    mainWindow.webContents.on('did-finish-load', function() {
      mainWindow.webContents.send('inputs', arg);
    });
  });
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
