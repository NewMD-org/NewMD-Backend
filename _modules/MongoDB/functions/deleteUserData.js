import { schema_userData } from "./mongo-schema.js";


export default async function deleteUserData(ID, PWD) {
    let code = 0;
    try {
        const data = await schema_userData.findOne({ userID: ID, userPassword: PWD }).exec();
        if (data == null) {
            return code = 2;
        }
        else if (data.userID == ID) {
            await schema_userData.findOneAndDelete({ userID: ID, userPassword: PWD });
            return code = 1;
        }
        else {
            return code;
        };
    } catch (error) {
        return code;
    };
}