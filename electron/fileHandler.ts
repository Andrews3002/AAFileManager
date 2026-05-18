import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_DIR = path.join(__dirname, "../storage/pdfs");

interface UploadedFile {
    name: string;
    buffer: Uint8Array;
}

async function savePDF(file: UploadedFile, refNum: number): Promise<string> {
    await fs.ensureDir(PDF_DIR);

    const fileName = `#${refNum}-${file.name}`;
    const filePath = path.join(PDF_DIR, fileName);

    await fs.writeFile(filePath, Buffer.from(file.buffer));

    return filePath;
}

async function removePDF(filepath: string): Promise<void> {
    await fs.remove(filepath);
}

export default { savePDF, removePDF };