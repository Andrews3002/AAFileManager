require("dotenv/config");
const fs = require("fs-extra");
const prismaPkg = require("@prisma/client/.prisma/client/default.js");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");

const { PrismaClient } = prismaPkg;
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

async function createEntry(data) {
    return await prisma.entry.create({
        data: {
            title: data.title,
            type: data.type,
            date: new Date(data.date),
            amount: data.amount,
            pdfPath: data.filePath,
        },
    });
}

async function getEntries() {
    return await prisma.entry.findMany({
        orderBy: {
            id: "desc",
        },
    });
}

async function deleteEntry(id) {
    const entry = await prisma.entry.findUnique({ where: { id } });

    if (entry.pdfPath) {
        await fs.remove(entry.pdfPath);
    }
    
    await prisma.entry.delete({
        where: { id },
    });

    const entries = await prisma.entry.findMany();

    if (entries.length === 0){
        return await prisma.$executeRaw`ALTER SEQUENCE "Entry_id_seq" RESTART WITH 1`;
    }
  
    return;
}

async function nextRefNum() {
    const lastEntry = await prisma.entry.findFirst({
        orderBy: {
            id: "desc",
        },
    });

    if (lastEntry) {
        return lastEntry.id + 1;
    }
    else{
        return 1;
    }
}

async function updateEntry(data) {
    return await prisma.entry.update({
        where: {
            id: data.id,
        },

        data: {
            title: data.title,
            type: data.type,
            date: new Date(data.date),
            amount: data.amount,
            pdfPath: data.pdfPath,
        },
    });
}

module.exports = {
    createEntry,
    getEntries,
    deleteEntry,
    updateEntry,
    nextRefNum,
};
