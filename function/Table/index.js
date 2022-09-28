import { testLogin } from "./testLogin.js";
import { fastTable } from "./fastTable.js";
import { slowTable } from "./slowTable.js";


export default class MdTimetableAPI {
    constructor(timeoutSec) {
        this.timeout = timeoutSec * 1000 | 0;
    }

    async login(ID, PWD) {
        return testLogin(ID, PWD, this.timeout);
    }

    async fastTable(ID, PWD) {
        return fastTable(ID, PWD, this.timeout);
    }

    async slowTable(ID, PWD) {
        return slowTable(ID, PWD, this.timeout);
    }
}