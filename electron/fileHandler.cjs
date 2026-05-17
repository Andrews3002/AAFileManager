const fs = require("fs-extra");
const path = require("path");
const { fileURLToPath } = require("url");

const PDF_DIR = path.join(__dirname, "../storage/pdfs");

async function savePDF(file, refNum) {
    await fs.ensureDir(PDF_DIR);

    const fileName = `#${refNum}-${file.name}`;
    const filePath = path.join(PDF_DIR, fileName);

    await fs.writeFile(
        filePath,
        Buffer.from(file.buffer)
    );

    return filePath;
}

async function removePDF(filepath) {
    await fs.remove(filepath);

    return;
}

module.exports = { savePDF, removePDF };