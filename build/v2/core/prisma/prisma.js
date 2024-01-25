"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const client_1 = require("@prisma/client");
exports.pool = new client_1.PrismaClient();
