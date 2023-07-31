import { schema_userData } from "./mongo-schema.js";


/**
 * Delete user data from the database.
 *
 * @param {string} ID - The user ID.
 * @param {string} PWD - The user password.
 * @returns {Promise<number>} A Promise that resolves to an integer indicating the operation result:
 * - 1: The user data was successfully deleted.
 * @throws {Error} If there was an error while executing the database operations or if the user data was not found or failed to delete.
 * @async
 * @example
 * const ID = 'username';
 * const PWD = 'password';
 *
 * try {
 *   const result = await deleteUserData(ID, PWD);
 *   console.log(result); // 1
 * } catch (error) {
 *   console.error(error.message);
 * }
 */

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