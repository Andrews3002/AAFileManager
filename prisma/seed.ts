import prisma from "../lib/prisma.ts";

async function seed() {
    await prisma.entry.createMany({
        data: [
            { title: "Document1", type: "DOCUMENT" },
            { title: "Document2", type: "FORM" },
            { title: "Document3", type: "RECIEPT" },
            { title: "Document4", type: "DOCUMENT" },
            { title: "Document5", type: "FORM" },
            { title: "Document6", type: "RECIEPT" },
        ],
    });
}

seed().then(() => prisma.$disconnect());