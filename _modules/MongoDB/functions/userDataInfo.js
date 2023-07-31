import { schema_userData } from "./mongo-schema.js";
import ReadableTime from "../../ReadableTime/index.js";


/**
 * Fetches user data information from the database.
 *
 * @typedef {Object} UserDataInfo
 * @property {number} userCount - The total number of users in the database.
 * @property {Object[]} staleData - An array of objects representing stale user data.
 * @property {string} staleData._id - The unique ID of the user data.
 * @property {string} staleData.userID - The user ID.
 * @property {string} staleData.userPassword - The user password.
 * @property {string} staleData.grade - The grade associated with the user data.
 * @property {string} staleData.expiredFor - The time duration for which the data has been expired, in a human-readable format.
 * 
 * @returns {Promise<UserDataInfo>} A Promise that resolves to an object containing user data information:
 * - `userCount`: The total number of users in the database.
 * - `staleData`: An array of stale user data objects.
 * @throws {Error} If there was an error while executing the database operations.
 * @async
 * @example
 * // Example usage:
 * try {
 *   const dataInfo = await userDataInfo();
 *   console.log(dataInfo.userCount); // 10 (for example)
 *   console.log(dataInfo.staleData); // [{ _id: '...', userID: '...', userPassword: '...', grade: '...', expiredFor: '...' }, ...]
 * } catch (error) {
 *   console.error(error);
 * }
 */
export default async function userDataInfo() {
    try {
        const allData = await schema_userData.find();

        const userCount = allData.length;
        const staleData = [];

        allData.forEach(user => {
            const updateAt = new Date(user.updatedAt).getTime();
            if (Date.now() - updateAt >= 432000000) {
                staleData.push({
                    _id: user._id.valueOf(),
                    userID: user.userID,
                    userPassword: user.userPassword,
                    grade: user.grade,
                    expiredFor: ReadableTime(Date.now() - updateAt).string
                });
            }
        });

        return {
            userCount,
            staleData
        };
    } catch (error) {
        console.error(error);
    }
}