import app from "../app.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import TWtime from '../function/TWtime.js';
import scheduleUpdateData from '../function/MongoDB/scheduleUpdateData.js';


dotenv.config();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
        keepAlive: true,
    });
    console.log(`[${TWtime().full}] | successfully connected to MongoDB, Database name: "${db.connections[0].name}"`);

    try {
        app.set('port', port);
        app.set('host', host);
        var server = app.listen(app.get('port'), app.get('host'), err => {
            if (err) throw err;
            console.error(`[${TWtime().full}] | server listening on ${server.address().address}:${server.address().port}`);
        });
    }
    catch (error) {
        console.error(error.message);
    };

    scheduleUpdateData();
}
catch (error) {
    console.error(error.message);
};