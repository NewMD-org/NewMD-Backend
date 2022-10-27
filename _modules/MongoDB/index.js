import readUserData from "./functions/readUserData.js";
import saveUserData from "./functions/saveUserData.js";
import deleteUserData from "./functions/deleteUserData.js";
import scheduleUpdateData from "./functions/scheduleUpdateData.js";


export default class MongoDB {
    read(ID, PWD) {
        return readUserData(ID, PWD);
    }
    save(ID, PWD, table) {
        return saveUserData(ID, PWD, table);
    }
    delete(ID, PWD) {
        return deleteUserData(ID, PWD);
    }
    scheduleUpdate(taskFreq){
        return scheduleUpdateData(taskFreq);
    }
}