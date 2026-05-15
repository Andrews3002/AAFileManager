import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PDF_DIR = path.join(__dirname, "../storage/pdfs");

async function savePDF(file, refNum) {
    await fs.ensureDir(PDF_DIR);

    const fileName = `#${refNum}-${file.name}`;
    const filePath = path.join(PDF_DIR, fileName);

    await fs.copy(file.path, filePath);

    return filePath;
}

export default { savePDF };