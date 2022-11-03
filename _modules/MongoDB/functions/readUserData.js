import { schema_userData } from "./mongo-schema.js";


export default async function readUserData(ID, PWD) {
    let code = 0;
    try {
        const data = await schema_userData.findOne({ userID: ID, userPassword: PWD }).exec();
        if (data == null) {
            code = 2;
            return {
                year: null,
                table: null,
                code: code,
            };
        }
        else if (data.userID == ID) {
            code = 1;
            return {
                year: data.year,
                table: data.table,
                code: code,
            };
        }
        else {
            return {
                year: null,
                table: null,
                code: code,
            };
        };
    }
    catch (error) {
        return {
            year: null,
            table: null,
            code: code,
        };
    };
}