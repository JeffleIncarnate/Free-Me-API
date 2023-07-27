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
const verifyArray_1 = require("../../core/verifyArray/verifyArray");
const router = express_1.default.Router();
router.get("/getAllJobs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "SELECT * FROM public.jobs";
    let sqlRes;
    try {
        sqlRes = yield pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    return res.send(sqlRes.rows);
}));
router.post("/createJob", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let arrOfItems = [
        req.body.uuid,
        req.body.title,
        req.body.description,
        req.body.place,
        req.body.company,
    ];
    if (!(0, verifyArray_1.verifyArray)(arrOfItems))
        return res.send({ detail: "Provide all items" });
    let query = {
        text: "SELECT * FROM public.users WHERE uuid=$1",
        values: [arrOfItems[0]],
    };
    let sqlRes;
    try {
        sqlRes = yield pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    //   if (sqlRes.rowCount === 0)
    //     return res.send({
    //       detail: "You can not create a post as you do not exist",
    //     });
    let getRandomInt = (max) => Math.floor(Math.random() * max);
    let postId = getRandomInt(100000000);
    query = {
        text: "SELECT * FROM public.jobs WHERE postid=$1",
        values: [postId],
    };
    for (;;) {
        let sqlRes = yield pool_1.pool.query(query);
        if (sqlRes.rowCount === 0)
            break;
        if (sqlRes.rows[0].postid !== postId)
            break;
    }
    let post = {
        postId: postId,
        posterId: req.body.uuid,
        title: req.body.title,
        description: req.body.description,
        place: req.body.place,
        company: req.body.company,
        time: Date.now(),
    };
    query = {
        text: "INSERT INTO public.jobs (posterid, title, description, place, companyname, postid, posttime) VALUES ($1, $2, $3, $4, $5, $6, $7);",
        values: [
            post.posterId,
            post.title,
            post.description,
            post.place,
            post.company,
            post.postId,
            post.time,
        ],
    };
    try {
        sqlRes = yield pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    return res.status(201).send({ detail: "Post created" });
}));
module.exports = router;
//# sourceMappingURL=jobOpportunities.js.map