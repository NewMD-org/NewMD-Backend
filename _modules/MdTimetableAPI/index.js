import { testLogin } from "./functions/testLogin.js";
import { fastTable } from "./functions/fastTable.js";
import { slowTable } from "./functions/slowTable.js";
import { viewVT } from "./functions/viewVT.js";


export default class MdTimetableAPI {
    constructor(timeoutSec) {
        this.timeout = timeoutSec * 1000 | 0;
    }

    login(ID, PWD) {
        return testLogin(ID, PWD, this.timeout);
    }

    fastTable(ID, PWD) {
        return fastTable(ID, PWD, this.timeout);
    }

    slowTable(ID, PWD) {
        return slowTable(ID, PWD, this.timeout);
    }

    viewVT(year, classID) {
        var cache = {};
        return viewVT(year, classID, cache, this.timeout);
    }
}