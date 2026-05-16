const { contextBridge, ipcRenderer } = require("electron");

// create global object called window.api to do (eg window.api.createEntry(data))
contextBridge.exposeInMainWorld("api", {
    createEntry: (data) => ipcRenderer.invoke("create-entry", data),

    getEntries: () => ipcRenderer.invoke("get-entries"),

    deleteEntry: (id) => ipcRenderer.invoke("delete-entry", id),

    updateEntry: (data) => ipcRenderer.invoke("update-entry", data),

    openPDF: (path) => ipcRenderer.invoke("open-pdf", path),

    savePDF: (file, refNum) => ipcRenderer.invoke("save-pdf", file, refNum),

    nextRefNum: () => ipcRenderer.invoke("next-refnum"),
});

console.log("PRELOAD LOADED");
