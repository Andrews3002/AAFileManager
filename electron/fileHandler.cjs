const fs = require("fs-extra");
const path = require("path");
const { fileURLToPath } = require("url");

const PDF_DIR = path.join(__dirname, "../storage/pdfs");

async function savePDF(file, refNum) {
    await fs.ensureDir(PDF_DIR);

    const fileName = `#${refNum}-${file.name}`;
    const filePath = path.join(PDF_DIR, fileName);

    await fs.copy(file.path, filePath);

    return filePath;
}

module.exports = { savePDF };