import schedule from 'node-schedule';
import { schema_userData } from './mongo-schema.js';
import slowTable from '../slowTable.js';
import TWtime from '../TWtime.js';


async function scheduleUpdateData() {
    const taskFreq = '00 00 * * *';
    schedule.scheduleJob(taskFreq, async () => {
        const data = await schema_userData.find({});
        data.forEach(async obj => {
            const ID = obj.userID;
            const PWD = obj.userPassword;
            const table = await slowTable(ID, PWD);
            await schema_userData.findOneAndUpdate(
                { userID: ID, userPassword: PWD },
                { table: table }
            );
            console.log(`[${TWtime().full}] | updated data for user : ${ID}`);
        });
    });
}

export default scheduleUpdateData;


/*\

*    *    *     *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

\*/