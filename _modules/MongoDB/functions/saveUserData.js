import { schema_userData } from "./mongo-schema.js";


export default async function storeUserData(ID, PWD, dataToSave) {
    console.log(dataToSave);
    try {
        const data = await schema_userData.findOne({ userID: ID, userPassword: PWD }).exec();
        if (data == null) {
            await new schema_userData({
                userID: ID,
                userPassword: PWD,
                year: dataToSave["year"],
                grade: dataToSave["grade"],
                selectedWeek: dataToSave["selectedWeek"],
                table: dataToSave["table"],
                updatedAt: new Date()
            }).save();
            return 0;
        }
        else if (data.userID == ID) {
            await schema_userData.findOneAndUpdate(
                { userID: ID, userPassword: PWD },
                {
                    year: dataToSave["year"],
                    grade: dataToSave["grade"],
                    selectedWeek: dataToSave["selectedWeek"],
                    table: dataToSave["table"],
                    updatedAt: new Date()
                }
            );
            return 1;
        }
        else {
            throw new Error("Failed to authorize");
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
}