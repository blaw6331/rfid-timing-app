/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import * as fs from 'fs';
import path from 'path';
import electron, { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import express from 'express';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

let raceFilePath: string = '';
let mainWindow: BrowserWindow | null = null;

const xmlparser = require('express-xml-bodyparser');

const reader = express();
const port = 3000;

reader.use(express.json());
reader.use(express.urlencoded());
//reader.use(xmlparser());

setTimeout(() => {
  reader.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
}, 5000);

reader.post('/api', (req, res) => {
  console.log(req.body.tagid);
  //const tagRead = JSON.parse(req.body);
  if (raceFilePath !== '') {
    fs.readFile(raceFilePath, 'utf8', (err, data) => {
      const raceData = JSON.parse(data);
      raceData?.Participants.forEach((el: any) => {
        el.Tags.forEach((tag: string) => {
          // eslint-disable-next-line
          if (tag == req.body.tagid) {
            console.log('found');
            el.TagReads.push({ Tag: tag, Time: new Date() }); // you will need to add the tag read time here and do a converstion
          }
        });
      });
      fs.writeFile(raceFilePath, JSON.stringify(raceData), 'utf-8', (error) => {
        if (error) {
          console.log(error);
        } else {
          fs.readFile(raceFilePath, 'utf8', (errror, newData) => {
            mainWindow?.webContents.send('json-loaded', newData);
            ipcMain.emit('json-loaded', newData);
          });
          console.log('Tag read written successfully');
        }
      });
    });
    res.status(200);
    res.send(req.body);
  } else {
    console.log('dont plug in the reader yet');
  }

  /*
  req.body['alien-rfid-reader-auto-notification'][
    'alien-rfid-tag-list'
  ].forEach((el) => {
    el['alien-rfid-tag'].forEach((tag) => {
      console.log(tag.tagid[0]);
      console.log(tag.discoverytime[0]);
    });
  });
  res.status(200);
  res.send('POST request received');
  */
});

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('load-json', (event, arg) => {
  const reply = (msg: string) => msg;
  dialog
    .showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'JSON', extensions: ['json'] }],
    })
    .then((result) => {
      fs.readFile(result.filePaths[0], 'utf8', (err, data) => {
        // eslint-disable-next-line prefer-destructuring
        raceFilePath = result.filePaths[0];
        event.reply('json-loaded', reply(data));
      });
    })
    .catch((err) => console.log(err));
});

ipcMain.on('add-participant', (event, arg) => {
  fs.readFile(raceFilePath, 'utf8', (err, data) => {
    const raceData = JSON.parse(data);
    raceData.Participants.push({
      NameFirst: 'Enter Name',
      NameLast: 'Enter Name',
      Other: 'Other info',
      Tags: ['Tag1', 'Tag2'],
      BibNumber: '1000',
      TagReads: [],
      startTime: '',
      finishTime: '',
      time: '',
    });
    fs.writeFile(raceFilePath, JSON.stringify(raceData), 'utf-8', (error) => {
      if (error) {
        console.error(error);
      } else {
        fs.readFile(raceFilePath, 'utf8', (errror, newData) => {
          mainWindow?.webContents.send('json-loaded', newData);
          ipcMain.emit('json-loaded', newData);
        });
        console.log('File written successfully');
      }
    });
  });
});

ipcMain.on('edit-participants', (event, arg) => {
  console.log(arg[0]);
  const [item, value, property] = arg;
  console.log(item, value, property);

  const reply = (msg: string) => msg;
  fs.readFile(raceFilePath, 'utf8', (err, data) => {
    //console.log('edit-participants');
    const jsonData = JSON.parse(data);
    //console.log(jsonData?.Participants);
    const itemInFileIdx = jsonData?.Participants?.findIndex(
      (Participant) => Participant?.BibNumber === item?.BibNumber
    );
    console.log(itemInFileIdx);

    jsonData.Participants[itemInFileIdx][property] = value;

    console.log(jsonData?.Participants[itemInFileIdx][property]);
    fs.writeFile(raceFilePath, JSON.stringify(jsonData), 'utf-8', (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('File written successfully');
        fs.readFile(raceFilePath, 'utf8', (errror, newData) => {
          event.reply('json-loaded', newData);
        });
      }
    });
    //jsonData?.Participants[itemInFileIdx].arg[2] = arg[1];
    //jsonData.participants[itemInFileIdx] = ;

    //fs.writeFile(raceFilePath, arg, (err) => {});
  });
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
