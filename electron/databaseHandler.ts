import fs from "fs-extra";
import prisma from "../lib/prisma.ts";
import { EntryType } from "../generated/prisma/index.js";

interface EntryData {
    id?: number;
    title: string;
    type: EntryType;
    date: Date | string;
    amount: number;
    filePath?: string | null;
}

async function createEntry(data: EntryData) {
    return await prisma.entry.create({
        data: {
            title: data.title,
            type: data.type,
            date: data.date,
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

async function deleteEntry(id: number) {
    const entry = await prisma.entry.findUnique({
        where: { id },
    });

    if (entry?.pdfPath) {
        await fs.remove(entry.pdfPath);
    }

    await prisma.entry.delete({
        where: { id },
    });

    const entries = await prisma.entry.findMany();

    if (entries.length === 0) {
        return await prisma.$executeRaw`
            ALTER SEQUENCE "Entry_id_seq" RESTART WITH 1
        `;
    }

    return;
}

async function nextRefNum(): Promise<number> {
    const lastEntry = await prisma.entry.findFirst({
        orderBy: {
            id: "desc",
        },
    });

    if (lastEntry) {
        return lastEntry.id + 1;
    } else {
        return 1;
    }
}

async function updateEntry(data: EntryData) {
    if (!data.id) {
        throw new Error("Entry ID is required");
    }

    return await prisma.entry.update({
        where: {
            id: data.id,
        },

        data: {
            title: data.title,
            type: data.type,
            date: data.date,
            amount: data.amount,
            pdfPath: data.filePath,
        },
    });
}

export default {
    createEntry,
    getEntries,
    deleteEntry,
    updateEntry,
    nextRefNum,
};
