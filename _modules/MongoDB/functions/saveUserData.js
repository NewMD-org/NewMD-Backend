import { schema_userData } from "./mongo-schema.js";


export default async function storeUserData(ID, PWD, dataToSave) {
    let code = 0;
    try {
        const data = await schema_userData.findOne({ userID: ID, userPassword: PWD }).exec();
        if (data == null) {
            await new schema_userData({
                userID: ID,
                userPassword: PWD,
                year: dataToSave["year"],
                table: dataToSave["table"],
                updatedAt: new Date()
            }).save();
            return code = 1;
        }
        else if (data.userID == ID) {
            await schema_userData.findOneAndUpdate(
                { userID: ID, userPassword: PWD },
                {
                    year: dataToSave["year"],
                    table: dataToSave["table"],
                    updatedAt: new Date()
                }
            );
            return code = 2;
        }
        else {
            return code;
        };
    }
    catch (error) {
        return code;
    };
}