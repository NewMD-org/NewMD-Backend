import app from "../app.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import TWtime from '../function/TWtime.js';

dotenv.config();

const port = process.env.PORT || 3000;

try {
    let db = await mongoose.connect(process.env.MONGO_URI, {
        keepAlive: true,
    });
    console.log(`[${TWtime().full}] | successfully connected to MongoDB, Database name: "${db.connections[0].name}"`);
    try {
        app.set('port', port);
        app.listen(app.get('port'));
        console.log(`[${TWtime().full}] | server is running on http://localhost:3000`);
    }
    catch (error) {
        console.error(error.message);
    };
}
catch (error) {
    console.error(error.message);
};