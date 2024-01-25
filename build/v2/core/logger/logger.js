"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
// Console Log object, used to make my console logs better
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
});
exports.logger = logger;
logger.add(new winston_1.transports.Console({
    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
}));
