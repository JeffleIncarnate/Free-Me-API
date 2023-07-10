"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyArray = void 0;
function verifyArray(items) {
    for (let i = 0; i < items.length; i++)
        if (items[i] === null || items[i] === undefined || items[i] === "")
            return false;
    return true;
}
exports.verifyArray = verifyArray;
//# sourceMappingURL=verifyArray.js.map