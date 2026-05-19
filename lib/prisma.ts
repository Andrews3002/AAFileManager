/// <reference types="node" />
//POSTGRESQL--------------------------------------------------------
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { app } from "electron";

dotenv.config({
    path: app.isPackaged ? path.join(process.resourcesPath, ".env") : ".env",
});

const connectionString = process.env.DATABASE_URL!;

const pool = new pg.Pool({
    connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

export default prisma;

//SQLITE---------------------------------------------------------------------------
// import "dotenv/config";

// import { PrismaClient } from "../generated/prisma/index.js";

// import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// const adapter = new PrismaBetterSqlite3({
//     url: process.env.DATABASE_URL!,
// });

// const prisma = new PrismaClient({
//     adapter,
// });

// export default prisma;


//run this when you swap databases> npm install -D electron-rebuild
//then run this if you swapped to sqlite > npx electron-rebuild -f -w better-sqlite3
