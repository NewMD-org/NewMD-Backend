import express from "express";
import { none, login, table, database } from "../controllers/cloud.js";


const router = express.Router();

router.post("/users/login", login);
// router.post("/users/logout", logout);
// query: [ID, PWD]

router.get("/table/:meetURL?", table);
// query: [ID, PWD, meetURL?]

router.get("/database/:action?", database);
// param: [save, read]
// query: [ID, PWD]

/* PAUSED */
// router.get("/stdData/:cookie", StdData);

router.get("/*", none);

export default router;