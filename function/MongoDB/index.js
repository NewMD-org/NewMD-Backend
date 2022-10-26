import readUserData from "./readUserData.js";
import saveUserData from "./saveUserData.js";
import deleteUserData from "./deleteUserData.js";


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
}