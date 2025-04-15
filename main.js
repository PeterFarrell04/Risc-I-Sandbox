const { app, ipcMain, BrowserWindow, Menu, dialog } = require('electron')
const fs = require('fs');
const path = require('path');
let win;

let thisFilePath = null;

function setFilePath(input)
{
    thisFilePath = input;
    win.setTitle(`${path.basename(thisFilePath)} -- RISC-I Sandbox`);
}

ipcMain.handle('save-file', async (event, content) => 
{
    if (!thisFilePath)
    {
        const { filePath } = await dialog.showSaveDialog({
        title: 'Save File',
        defaultPath: 'untitled.risc',
        filters: [{ name: 'Risc Files', extensions: ['risc'] }],
        });
    
        if (filePath) {
        fs.writeFileSync(filePath, content, 'utf8');
        }
        setFilePath(filePath);
    }else
    {
        fs.writeFileSync(thisFilePath,content,'utf8');
    }
});

ipcMain.handle('save-file-as', async (event, content) => 
    {
        const { filePath } = await dialog.showSaveDialog({
        title: 'Save File As',
        defaultPath: `${path.basename(thisFilePath,".risc")}-Copy`,
        filters: [{ name: 'Risc Files', extensions: ['risc'] }],
        });
        
        if (filePath) {
        fs.writeFileSync(filePath, content, 'utf8');
        setFilePath(filePath);
        }
        
    });


ipcMain.handle('load-file', async () => {
    const { filePaths } = await dialog.showOpenDialog({
      title: 'Open File',
      properties: ['openFile'],
      filters: [{ name: 'Risc Files', extensions: ['risc'] }],
    });
  
    if (filePaths && filePaths[0]) {
      const content = fs.readFileSync(filePaths[0], 'utf8');
      setFilePath(filePaths[0]);
      return content;
    }
    return null;
});

const createWindow = () => {
    win = new BrowserWindow({
      width: 1280,
      height: 720,
      center: true,
      icon: "./src/assets/icon.png",
      backgroundColor: '#f7f7f7',
      webPreferences: {
        nodeIntegration:true,
        contextIsolation: false
      }
    });

    win.loadFile('index.html')
    const template = [
        {
            label:"File",
            submenu: [
                {
                    label:"Open File",
                    accelerator:"Ctrl+O",
                    click: () => {
                    win.webContents.send('menu-open');
                    }
                },
                {
                    label:"Save File",
                    accelerator:"Ctrl+S",
                    click: () => {
                    win.webContents.send('menu-save');
                    }
                },
                {
                    label:"Save File As",
                    accelerator:"Ctrl+Shift+S",
                    click: () => {
                    win.webContents.send('menu-save-as');
                    }
                },
                { type: 'separator' },
                {role:"quit", label:"Exit"}
            ]
        },
        {
            label:"Edit",
            submenu: [
                {role:"undo", label:"Undo"},
                {role:"redo", label:"Redo"},
                { type: 'separator' },
                {role:"cut", label:"Cut"},
                {role:"copy", label:"Copy"},
                {role:"paste", label:"Paste"},

            ]
        },
        {
            label:"Run",
            click: () => {
            win.webContents.send('menu-run');
            }
        }
    ]
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    win.maximize();

    //delete
    win.webContents.openDevTools();
  }

  app.whenReady().then(() => {
    createWindow()
  })