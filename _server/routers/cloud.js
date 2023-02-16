import express from "express";
import { readFileSync } from "fs";

import ReadableTime from "../../_modules/ReadableTime/index.js";
import { login } from "../controllers/cloud/Login.js";
import { table } from "../controllers/cloud/Table.js";
import { database } from "../controllers/cloud/Database.js";
import { viewvt } from "../controllers/cloud/ViewVT.js";
import { getweeklist } from "../controllers/cloud/GetWeekList.js";


const router = express.Router();
const packageJSON = JSON.parse(readFileSync("./package.json"));

router.get("/ping", (_, res) => {
    res.status(200).json(`Service is up : ${ReadableTime(Math.round(performance.now()))["string"]} | API v${packageJSON.version}`);
});

router.post("/users/login", login);

router.get("/table", table);

router.get("/viewvt", viewvt);

router.get("/database/:action?", database);

router.get("/getweeklist", getweeklist);

router.get("/*", (_, res) => {
    res.status(400).json("Please insert correct path");
});

export default router;