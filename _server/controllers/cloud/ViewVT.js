import MdTimetableAPI from "../../../_modules/MdTimetableAPI/index.js";
import CheckRequestRequirement from "../../../_modules/CheckRequestRequirement/index.js";


const APItimeout10 = new MdTimetableAPI(10);

export const viewvt = async (req, res) => {
    try {
        new CheckRequestRequirement(req, res).hasQuery(["year", "classID"]);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }

    const year = req.query.year;
    const classID = req.query.classID;

    try {
        return res.status(200).json(await APItimeout10.viewVT(year, classID, 0));
    }
    catch (error) {
        return res.status(500).json({ message: "MD server error" });
    }
};