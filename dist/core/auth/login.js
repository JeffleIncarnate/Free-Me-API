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
require("dotenv").config({ path: "../../.env" });
const verifyArray_1 = require("../verifyArray/verifyArray");
const argon2_1 = require("../argon2/argon2");
const pool_1 = require("../database/pool");
const jwt_1 = require("../jwt/jwt");
let router = express_1.default.Router();
router.use(express_1.default.json());
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let arrOfItems = [req.body.username, req.body.password];
    if (!(0, verifyArray_1.verifyArray)(arrOfItems))
        return res.status(400).send({ detail: "Provide all items" });
    let sqlRes;
    let query = {
        text: "SELECT password, uuid FROM public.users WHERE email=$1",
        values: [arrOfItems[0]],
    };
    try {
        sqlRes = yield pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    if (sqlRes.rowCount === 0)
        return res.status(400).send({ detail: "User does not exist" });
    if (!(yield (0, argon2_1.verifyHash)(sqlRes.rows[0].password, arrOfItems[1])))
        return res.status(401).send({ detail: "Incorrect password" });
    let user = {
        uuid: sqlRes.rows[0].uuid,
        scopes: {
            getSelf: true,
            mofifySelf: true,
            deleteSelf: true,
            getOtherUsers: false,
            createUsers: false,
            deleteUsers: false,
            updateUsers: false,
        },
    };
    let token = (0, jwt_1.createToken)(user);
    return res.send({ accessToken: token, expiresIn: "15m" });
}));
module.exports = router;
//# sourceMappingURL=login.js.map