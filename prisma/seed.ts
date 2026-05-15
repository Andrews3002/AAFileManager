import prismaPkg from "../node_modules/@prisma/client/.prisma/client/default.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { PrismaClient } = prismaPkg;
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

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
