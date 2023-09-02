export default function checkQuery(request, requiredBody) {
    if (!hasAllRequiredBody(request.body, requiredBody)) {
        throw new Error(`The following items are all required for this route: [${requiredBody.join(", ")}]`);
    }

    if (Object.keys(request.body).length > requiredBody.length) {
        throw new Error(`Only allowed ${requiredBody.length} items in the body: [${requiredBody.join(", ")}]`);
    }
}

function hasAllRequiredBody(body, requiredBody) {
    return requiredBody.every(item => Object.keys(body).includes(item));
}