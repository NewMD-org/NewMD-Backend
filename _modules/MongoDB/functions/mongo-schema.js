import mongoose from "mongoose";


const Schema = mongoose.Schema;

const userData = new Schema({
    userID: String,
    userPassword: String,
    year: String,
    table: Object,
    updatedAt: { type: Date, default: Date.now },
});

export const schema_userData = mongoose.model("user-data", userData, "user-data");