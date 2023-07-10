"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config({ path: `${__dirname}/../../.env` });
const pool_1 = require("../../core/database/pool");
const argon2_1 = require("../../core/argon2/argon2");
const verifyArray_1 = require("../../core/verifyArray/verifyArray");
const router = express_1.default.Router();
let updateUser = (uuid, col, dataTo) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {
        text: "SUSSY MAONG HSHAHFGDAKJFHIWRYFL",
        values: ["ASMFOIAEG"],
    };
    if (col === "username") {
        query["text"] = "UPDATE users SET username=$1 WHERE uuid=$2";
        query["values"] = [dataTo, uuid];
        try {
            yield pool_1.pool.query(query);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    else if (col === "firstname") {
        query["text"] = "UPDATE users SET firstname=$1 WHERE uuid=$2";
        query["values"] = [dataTo, uuid];
        try {
            yield pool_1.pool.query(query);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    else if (col === "lastname") {
        query["text"] = "UPDATE users SET lastname=$1 WHERE uuid=$2";
        query["values"] = [dataTo, uuid];
        try {
            yield pool_1.pool.query(query);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    else if (col === "address") {
        query["text"] = "UPDATE users SET address=$1 WHERE uuid=$2";
        query["values"] = [dataTo, uuid];
        try {
            yield pool_1.pool.query(query);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    else if (col === "password") {
        query["text"] = "UPDATE users SET password=$1 WHERE uuid=$2";
        query["values"] = [yield (0, argon2_1.hashPassword)(dataTo), uuid];
        try {
            yield pool_1.pool.query(query);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    else if (col === "email") {
        query["text"] = "UPDATE users SET email=$1 WHERE uuid=$2";
        query["values"] = [dataTo, uuid];
        try {
            yield pool_1.pool.query(query);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    else if (col === "phonenumber") {
        query["text"] = "UPDATE users SET phonenumber=$1 WHERE uuid=$2";
        query["values"] = [dataTo, uuid];
        try {
            yield pool_1.pool.query(query);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    else if (col === "nzbn") {
        query["text"] = "UPDATE users SET nzbn=$1 WHERE uuid=$2";
        query["values"] = [dataTo, uuid];
        try {
            yield pool_1.pool.query(query);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    else if (col === "gst") {
        query["text"] = "UPDATE users SET gst=$1 WHERE uuid=$2";
        query["values"] = [dataTo, uuid];
        try {
            yield pool_1.pool.query(query);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    else {
        return false;
    }
});
router.put("/updateUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let arrOfItems = [req.query.uuid, req.body.col, req.body.dataTo];
    let user = {
        uuid: arrOfItems[0],
        col: arrOfItems[1],
        dataTo: arrOfItems[2],
    };
    if (!(0, verifyArray_1.verifyArray)(arrOfItems))
        return res.status(400).send({ detail: "Provide all items" });
    if (req.body.col !== "username" &&
        req.body.col !== "firstname" &&
        req.body.col !== "lastname" &&
        req.body.col !== "address" &&
        req.body.col !== "password" &&
        req.body.col !== "email" &&
        req.body.col !== "phonenumber" &&
        req.body.col !== "nzbn" &&
        req.body.col !== "gst")
        return res
            .status(400)
            .send({ detail: "Can not change column if it does not exist" });
    let query = {
        text: "SELECT * FROM users WHERE uuid=$1",
        values: [user.uuid],
    };
    let sqlRes;
    try {
        sqlRes = yield pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(400).send({ detail: err.stack });
    }
    if (sqlRes.rowCount === 0)
        return res.status(400).send({ detail: "User does not exist." });
    let response = yield updateUser(user.uuid, user.col, user.dataTo);
    if (!response)
        return res.status(400).send({ detail: "Unknown error" });
    return res.send({ detail: "Updated user" });
}));
module.exports = router;
//# sourceMappingURL=updateUser.js.map