import "dotenv/config";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import fileHandler from "./fileHandler.js";
import db from "./databaseHandler.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    const loadURL = app.isPackaged
        ? `file://${path.join(__dirname, "../dist/index.html")}`
        : "http://localhost:5173";

    win.loadURL(loadURL);

    if (!app.isPackaged) {
        win.webContents.openDevTools();
    }
}

ipcMain.handle("create-entry", async (_, data) => {
    return await db.createEntry(data);
});

ipcMain.handle("get-entries", async () => {
    return await db.getEntries();
});

ipcMain.handle("delete-entry", async (_, id) => {
    return await db.deleteEntry(id);
});

ipcMain.handle("update-entry", async (_, data) => {
    return await db.updateEntry(data);
});

ipcMain.handle("open-pdf", async (_, path) => {
    await shell.openPath(path);
});

ipcMain.handle("save-pdf", async (_, file, refNum) => {
    return await fileHandler.savePDF(file, refNum);
});

ipcMain.handle("remove-pdf", async (_, filepath) => {
    return await fileHandler.removePDF(filepath);
});

ipcMain.handle("next-refnum", async () => {
    return await db.nextRefNum();
});

app.whenReady().then(createWindow);
