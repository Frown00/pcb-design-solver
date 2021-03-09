import { app, BrowserWindow, dialog, Menu, MenuItemConstructorOptions } from 'electron';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    darkTheme: true,
    thickFrame: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// const filepath = path.join(__dirname, '.', 'test-data/zad0.txt');
// async function loadFile() {
//   const data = dialog.showOpenDialog({
//     filters: [{ name: 'Text', extensions: ['txt']}],
//     properties: ['openFile']
//   });
//   console.log(data);
// }

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const mainMenuTemplate: MenuItemConstructorOptions[] = [
  // {
  //   label: 'File',
  // },
  // {
  //   label: 'Load file',
  //   click() {
  //     loadFile();
  //   }
  // },
  // {
  //   label: 'Quit',
  //   accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
  //   click() {
  //     app.quit();
  //   }
  // }
]
