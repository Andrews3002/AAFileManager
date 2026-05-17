require("dotenv/config");
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const fileHandler = require("./fileHandler.cjs");
const db = require("./databaseHandler.cjs");
const path = require("path");

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,

        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    win.webContents.session.webRequest.onHeadersReceived(
        (details, callback) => {
            callback({
                responseHeaders: {
                    ...details.responseHeaders,
                    "Content-Security-Policy": [
                        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self' http://localhost:5173 ws://localhost:5173; style-src 'self' 'unsafe-inline';",
                    ],
                },
            });
        },
    );

    win.loadURL("http://localhost:5173");
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

ipcMain.handle("next-refnum", async () => {
    return await db.nextRefNum();
});

app.whenReady().then(createWindow);
