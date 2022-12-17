import MdTimetableAPI from "../../../_modules/MdTimetableAPI/index.js";


const APItimeout10 = new MdTimetableAPI(10);

export const viewvt = async (req, res) => {
    const RequiredQuery = ["year", "classID"];
    const hasAllRequiredQuery = RequiredQuery.every(item => Object.keys(req.query).includes(item));
    if (!hasAllRequiredQuery || Object.keys(req.query).length < RequiredQuery.length) {
        return res.status(400).send(`The following items are all required for this route : [${RequiredQuery.join(", ")}]`);
    }
    else if (Object.keys(req.query).length > RequiredQuery.length) {
        return res.status(400).send(`Only allowed ${RequiredQuery.length} items in the body : [${RequiredQuery.join(", ")}]`);
    }

    const year = req.query.year;
    const classID = req.query.classID;

    try {
        return res.status(200).json(await APItimeout10.viewVT(year, classID));
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
};