import { schema_userData } from './mongo-schema.js';


async function storeUserData(ID, PWD, table) {
    let code = 0;
    try {
        const data = await schema_userData.findOne({ userID: ID }).exec();
        if (data == null) {
            await new schema_userData({
                userID: ID,
                userPassword: PWD,
                table: table,
            }).save();
            return code = 1;
        }
        else if (data.userID == ID) {
            await schema_userData.findOneAndUpdate(
                { userID: ID, userPassword: PWD },
                { table: table }
            );
            return code = 2;
        }
        else {
            return code;
        };
    } catch (error) {
        return code;
    };
}

export default storeUserData;