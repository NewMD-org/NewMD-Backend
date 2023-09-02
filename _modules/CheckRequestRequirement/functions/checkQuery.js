export default function checkQuery(request, requiredQuery) {
    if (!hasAllRequiredQuery(request.query, requiredQuery)) {
        throw new Error(`The following items are all required for this route: [${requiredQuery.join(", ")}]`);
    }

    if (Object.keys(request.query).length > requiredQuery.length) {
        throw new Error(`Only allowed ${requiredQuery.length} items in the query: [${requiredQuery.join(", ")}]`);
    }
}

function hasAllRequiredQuery(query, requiredQuery) {
    return requiredQuery.every(item => Object.keys(query).includes(item));
}