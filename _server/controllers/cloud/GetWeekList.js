import MdTimetableAPI from "../../../_modules/MdTimetableAPI/index.js";
import CheckRequestRequirement from "../../../_modules/CheckRequestRequirement/index.js";


const APItimeout5 = new MdTimetableAPI(5);

export const getweeklist = async (req, res) => {
    try {
        new CheckRequestRequirement(req, res).hasQuery(["year"]);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }

    const year = req.query.year;

    try {
        return res.status(200).json(await APItimeout5.getWeekList(year));
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};