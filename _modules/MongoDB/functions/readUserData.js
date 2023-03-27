import { schema_userData } from "./mongo-schema.js";


export default async function readUserData(ID, PWD) {
    try {
        const data = await schema_userData.findOne({ userID: ID, userPassword: PWD }).exec();
        if (data == null) {
            throw new Error("User data not found");
        }
        else if (data.userID == ID) {
            return data;
        }
        else {
            throw new Error("Failed to read user data");
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
}