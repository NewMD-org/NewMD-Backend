import server from "./_server/server.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { TWtime } from "./_modules/TWtime/index.js";
import MongoDB from "./_modules/MongoDB/index.js";


dotenv.config();

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

try {
    const db = await mongoose.connect(process.env.MONGO_URI, { keepAlive: true });
    console.log(`[${TWtime().full}] | successfully connected to MongoDB, Database name: "${db.connections[0].name}"`);
    server.set("port", port);
    server.set("host", host);
    var app = server.listen(server.get("port"), server.get("host"), err => {
        if (err) throw err;
        console.error(`[${TWtime().full}] | server listening on ${host}:${app.address().port}`);
        new MongoDB().scheduleUpdate("00 00 * * *");
    });
}
catch (error) {
    console.error(error.message);
};