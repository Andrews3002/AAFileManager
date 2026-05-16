require("dotenv/config");
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
            pdfPath: data.pdfPath,
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
    return await prisma.entry.delete({
        where: { id },
    });
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

    return 1;
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
