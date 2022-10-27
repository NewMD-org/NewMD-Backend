import express from "express";
import { login, table } from "../controllers/cloud/Table.js";
import { database } from "../controllers/cloud/Database.js";


const router = express.Router();

router.post("/users/login", login);

router.get("/table/:meetURL?", table);

router.get("/database/:action?", database);

router.get("/*", (_, res) => {
    res.status(400).json("Please insert correct path.");
});

export default router;