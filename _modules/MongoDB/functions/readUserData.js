import { schema_userData } from "./mongo-schema.js";


export default async function readUserData(ID, PWD) {
    let code = 0;
    try {
        const data = await schema_userData.findOne({ userID: ID, userPassword: PWD }).exec();
        if (data == null) {
            code = 2;
            return {
                data: null,
                code: code,
            };
        }
        else if (data.userID == ID) {
            code = 1;
            return {
                data: data.table,
                code: code,
            };
        }
        else {
            return {
                data: null,
                code: code,
            };
        };
    }
    catch (error) {
        return {
            data: null,
            code: code,
        };
    };
}