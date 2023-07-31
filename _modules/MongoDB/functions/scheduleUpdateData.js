import schedule from "node-schedule";
import MdTimetableAPI from "../../MdTimetableAPI/index.js";
import ReadableTime from "../../ReadableTime/index.js";
import { schema_userData } from "./mongo-schema.js";
import storeUserData from "./saveUserData.js";
import userDataInfo from "./userDataInfo.js";
import deleteUserData from "./deleteUserData.js";


const APItimeout60 = new MdTimetableAPI(60);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function scheduleUpdateData(taskFreq) {
    console.log(`Update user data : scheduled update user data. Task frequency: " ${taskFreq} "`);
    schedule.scheduleJob(taskFreq, async () => {
        await cleanUserData();
        await updateUserData();
    });
}

async function cleanUserData() {
    const { userCount, staleData } = await userDataInfo();

    console.log(`Up to date : ${userCount - staleData.length}`);
    console.log(`Outdated : ${staleData.length}`);
    staleData.forEach(user => {
        deleteUserData(user.userID, user.userPassword);
        console.log(`Clean user data : deleted data of user ${user.userID}, expired for ${user.expiredFor}`);
    });
}

async function updateUserData() {
    console.log("Update user data : start");

    const t0 = performance.now();
    const finishUsers = [];
    const unfinishedUsers = [];
    const loopLimit = 10;
    let loop = 0;

    const data = await schema_userData.find({});
    data.forEach((obj) => {
        const ID = obj.userID;
        const PWD = obj.userPassword;
        unfinishedUsers.push({
            ID,
            PWD
        });
    });

    while ((loop < loopLimit) && unfinishedUsers[unfinishedUsers.length - 1]) {
        loop += 1;
        console.log(`Update user data : Loop ${loop} - start`);
        const t00 = performance.now();
        const length = unfinishedUsers.length;

        for (let i = 0; i < length; i++) {
            if (unfinishedUsers[i] === null) continue;
            const ID = unfinishedUsers[i].ID;
            const PWD = unfinishedUsers[i].PWD;
            unfinishedUsers[i] = null;

            console.log(`Update user data : user ${ID} - start`);
            try {
                const slowTableData = await APItimeout60.slowTable(ID, PWD);
                await storeUserData(ID, PWD, slowTableData);
                finishUsers.push({
                    ID,
                    PWD
                });
                console.log(`Update user data : user ${ID} - success`);
            }
            catch (error) {
                unfinishedUsers.push({
                    ID,
                    PWD
                });
                console.log(`Update user data : user ${ID} - failed`);
            }

            await sleep(5000);
        }

        const t01 = performance.now();
        console.log(`Update user data : Loop ${loop} - finished (took ${ReadableTime(Math.round(t01 - t00))["string"]})`);
    }

    const t1 = performance.now();
    console.log(`Update user data : looped ${loop} times, finished ${finishUsers.length} users (took ${ReadableTime(Math.round(t1 - t0))["string"]})`);
    console.log("Update user data : unfinished users > " + (unfinishedUsers.filter(n => n).map(obj => obj["ID"]).join(", ") || "none"));
}