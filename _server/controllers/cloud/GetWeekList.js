import MdTimetableAPI from "../../../_modules/MdTimetableAPI/index.js";


const APItimeout5 = new MdTimetableAPI(5);

export const getweeklist = async (req, res) => {
    const RequiredQuery = ["year"];
    const hasAllRequiredQuery = RequiredQuery.every(item => Object.keys(req.query).includes(item));
    if (!hasAllRequiredQuery || Object.keys(req.query).length < RequiredQuery.length) {
        return res.status(400).send(`The following items are all required for this route : [${RequiredQuery.join(", ")}]`);
    }
    else if (Object.keys(req.query).length > RequiredQuery.length) {
        return res.status(400).send(`Only allowed ${RequiredQuery.length} items in the body : [${RequiredQuery.join(", ")}]`);
    }

    const year = req.query.year;

    try {
        return res.status(200).json(await APItimeout5.getWeekList(year));
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};