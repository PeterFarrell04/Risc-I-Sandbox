const { ipcRenderer } = require('electron');
const { openFile, runFile, saveFile, saveFileAs} = require('./src/frontend/editor');


const content = document.getElementById('content');
const lineNumbers = document.getElementById('line-numbers');

ipcRenderer.on("menu-open", () => {
    openFile();
});

ipcRenderer.on("menu-save", () => {
    saveFile();
});

ipcRenderer.on("menu-save-as", () => {
    saveFileAs();
});

ipcRenderer.on("menu-run", () => {
    runFile();
});
