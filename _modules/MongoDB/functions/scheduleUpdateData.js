import schedule from "node-schedule";
import MdTimetableAPI from "../../MdTimetableAPI/index.js";
import { schema_userData } from "./mongo-schema.js";


const APItimeout60 = new MdTimetableAPI(60);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function scheduleUpdateData(taskFreq) {
    console.log(`Update user data : scheduled update user data. Task frequency: " ${taskFreq} "`);
    schedule.scheduleJob(taskFreq, async () => {
        const t0 = performance.now();
        const finishUsers = [];
        const unfinishUsers = [];
        const loopLimit = 10;
        var loop = 0;

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

            for (var i = 0; i < length; i++) {
                if (unfinishUsers[i] === null) continue;
                const ID = unfinishUsers[i].ID;
                const PWD = unfinishUsers[i].PWD;
                unfinishUsers[i] = null;

                console.log(`Update user data : user ${ID} - start`);
                try {
                    const slowTableData = await APItimeout60.slowTable(ID, PWD);
                    if (!slowTableData.error) {
                        await schema_userData.findOneAndUpdate(
                            { userID: ID, userPassword: PWD },
                            {
                                year: slowTableData["year"],
                                table: slowTableData["table"]
                            }
                        );
                        finishUsers.push({
                            ID,
                            PWD
                        });
                        console.log(`Update user data : user ${ID} - success`);
                    }
                    else {
                        throw new Error(slowTableData.error);
                    };
                }
                catch (error) {
                    unfinishUsers.push({
                        ID,
                        PWD
                    });
                    console.log(`Update user data : user ${ID} - failed`);
                };

                await sleep(5000);
            }

            const t01 = performance.now();
            console.log(`Update user data : Loop ${loop} - finished (took ${Math.round(t01 - t00) / 1000} seconds)`);
            console.log(`Update user data : finished ${finishUsers.length} users`);
        }

        const t1 = performance.now();
        console.log(`Update user data : looped ${loop} times, finished ${finishUsers.length} users (took ${Math.round(t1 - t0) / 1000} seconds)`);
        console.log("Update user data : unfinishUsers\n" + unfinishUsers.filter(n => n).map(obj => obj["ID"]).join("\n"));
    });
}