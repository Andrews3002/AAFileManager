import "dotenv/config";
import { app, BrowserWindow, ipcMain, shell, dialog } from "electron";
import fileHandler from "./fileHandler.ts";
import db from "./databaseHandler.ts";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win = null

function createWindow() {
    win = new BrowserWindow({
        width: 1400,
        height: 900,

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    

    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, "../renderer-dist/index.html"));
    } else {
        win.loadURL("http://localhost:5173");
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

ipcMain.handle("confirm-delete", async () => {
    const result = await dialog.showMessageBox(win!, {
        type: "warning",
        buttons: ["Cancel", "Delete"],
        defaultId: 0,
        cancelId: 0,
        title: "Confirm Delete",
        message: "Delete this entry?",
        detail: "This action cannot be undone.",
    });
    return result.response === 1;
});

app.whenReady().then(createWindow);