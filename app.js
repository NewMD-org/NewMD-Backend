import server from "./_server/server.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import MongoDB from "./_modules/MongoDB/index.js";


dotenv.config();

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

try {
    mongoose.set("strictQuery", false);
    const db = await mongoose.connect(process.env.MONGO_URI, { keepAlive: true });
    console.log(`Server : successfully connected to MongoDB, Database name: "${db.connections[0].name}"`);
    server.set("port", port);
    server.set("host", host);
    let app = server.listen(server.get("port"), server.get("host"), err => {
        if (err) throw err;
        console.error(`Server : listening on ${host}:${app.address().port}`);
        new MongoDB().scheduleUpdate("00 00 00 * * *");
    });
}
catch (error) {
    console.error(error.message);
}


/*\
Cron-style Scheduling

*    *    *     *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

\*/