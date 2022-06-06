import mongoose from "mongoose";


const Schema = mongoose.Schema;

const userData = new Schema({
    userID: String,
    userPassword: String,
    table: Object,
});

export const schema_userData = mongoose.model("user-data", userData, "user-data");