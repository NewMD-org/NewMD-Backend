import { schema_userData } from "./mongo-schema.js";


/**
 * Store user data in the database or update existing user data.
 *
 * @param {string} ID - The user ID.
 * @param {string} PWD - The user password.
 * @param {Object} dataToSave - The data to store or update for the user.
 * @param {string} dataToSave.userID - The user ID.
 * @param {string} dataToSave.userPassword - The user password.
 * @param {string} dataToSave.year - The year associated with the user data.
 * @param {Object} dataToSave.table - The table data associated with the user data.
 * @param {Date} dataToSave.updatedAt - The update timestamp associated with the user data.
 * @returns {Promise<number>} A Promise that resolves to an integer indicating the operation result:
 * - 0: The data was successfully stored for a new user.
 * - 1: The data was successfully updated for an existing user.
 * @throws {Error} If there was an error while executing the database operations or failed to authorize the user.
 * @async
 * @example
 * const ID = 'username';
 * const PWD = 'password';
 * const dataToSave = {
 *   userID: 'username',
 *   userPassword: 'password',
 *   year: '1123',
 *   table: { ... },
 *   updatedAt: new Date()
 * };
 *
 * try {
 *   const result = await storeUserData(ID, PWD, dataToSave);
 *   console.log(result); // 0 or 1
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
export default async function storeUserData(ID, PWD, dataToSave) {
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