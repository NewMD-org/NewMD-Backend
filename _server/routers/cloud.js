import express from "express";
import { readFileSync } from "fs";
import { rateLimit } from "express-rate-limit";

import ReadableTime from "../../_modules/ReadableTime/index.js";
import { login } from "../controllers/cloud/Login.js";
import { table } from "../controllers/cloud/Table.js";
import { database } from "../controllers/cloud/Database.js";
import { viewvt } from "../controllers/cloud/ViewVT.js";
import { getweeklist } from "../controllers/cloud/GetWeekList.js";


const router = express.Router();
const packageJSON = JSON.parse(readFileSync("./package.json"));

const limiter_1m_10req = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: "Too many requests, please try again after 1 minute!"
});

const limiter_1m_20req = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    message: "Too many requests, please try again after 1 minute!"
});

router.get("/ping", (_, res) => {
    res.status(200).json({
        "service": "up",
        "uptime": ReadableTime(Math.round(performance.now()))["string"],
        "api": `v${packageJSON.version}`,
    });
});

router.use("/users/login", limiter_1m_10req);
router.post("/users/login", login);

router.use("/table", limiter_1m_20req);
router.get("/table", table);

router.get("/viewvt", viewvt);

router.use("/database/:action?", limiter_1m_20req);
router.get("/database/:action?", database);

router.get("/getweeklist", getweeklist);

router.get("/*", (_, res) => {
    res.status(200).json("Please insert correct path");
});

export default router;