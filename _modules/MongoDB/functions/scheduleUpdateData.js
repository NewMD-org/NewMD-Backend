import schedule from "node-schedule";
import MdTimetableAPI from "../../MdTimetableAPI/index.js";
import ReadableTime from "../../ReadableTime/index.js";
import { schema_userData } from "./mongo-schema.js";


const APItimeout60 = new MdTimetableAPI(60);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function scheduleUpdateData(taskFreq) {
    console.log(`Update user data : scheduled update user data. Task frequency: " ${taskFreq} "`);
    schedule.scheduleJob(taskFreq, async () => {
        console.log("Update user data : start");

        const t0 = performance.now();
        const finishUsers = [];
        const unfinishUsers = [];
        const loopLimit = 10;
        let loop = 0;

        const data = await schema_userData.find({});
        data.forEach((obj) => {
            const ID = obj.userID;
            const PWD = obj.userPassword;
            unfinishUsers.push({
                ID,
                PWD
            });
        });

        while ((loop < loopLimit) && unfinishUsers[unfinishUsers.length - 1]) {
            loop += 1;
            console.log(`Update user data : Loop ${loop} - start`);
            const t00 = performance.now();
            const length = unfinishUsers.length;

            for (let i = 0; i < length; i++) {
                if (unfinishUsers[i] === null) continue;
                const ID = unfinishUsers[i].ID;
                const PWD = unfinishUsers[i].PWD;
                unfinishUsers[i] = null;

                console.log(`Update user data : user ${ID} - start`);
                try {
                    const slowTableData = await APItimeout60.slowTable(ID, PWD);
                    await schema_userData.findOneAndUpdate(
                        { userID: ID, userPassword: PWD },
                        {
                            year: slowTableData["year"],
                            grade: slowTableData["grade"],
                            selectedWeek: slowTableData["selectedWeek"],
                            table: slowTableData["table"],
                            updatedAt: new Date()
                        }
                    );
                    finishUsers.push({
                        ID,
                        PWD
                    });
                    console.log(`Update user data : user ${ID} - success`);
                }
                catch (error) {
                    unfinishUsers.push({
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
        console.log("Update user data : unfinish users > " + (unfinishUsers.filter(n => n).map(obj => obj["ID"]).join(", ") || "none"));
    });
}