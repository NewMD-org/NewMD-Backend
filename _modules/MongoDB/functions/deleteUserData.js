import { schema_userData } from "./mongo-schema.js";


export default async function deleteUserData(ID, PWD) {
    try {
        const data = await schema_userData.findOne({ userID: ID, userPassword: PWD }).exec();
        if (data == null) {
            throw new Error("User data not found");
        }
        else if (data.userID == ID) {
            await schema_userData.findOneAndDelete({ userID: ID, userPassword: PWD });
            return 1;
        }
        else {
            throw new Error("Failed to delete user data");
        }
    } catch (error) {
        throw new Error(error.message);
    }
}