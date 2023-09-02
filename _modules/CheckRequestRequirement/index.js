import checkQuery from "./functions/checkQuery.js";
import checkBody from "./functions/checkBody.js";


export default class CheckRequestRequirement {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    hasQuery(requiredQuery) {
        return checkQuery(this.request, requiredQuery);
    }

    hasBody(requiredBody) {
        return checkBody(this.request, requiredBody);
    }
}