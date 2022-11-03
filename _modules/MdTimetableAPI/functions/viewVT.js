import axios from "axios";
import { load } from "cheerio";


export async function viewVT(year, classID, cache) {
    if (Object.keys(cache).includes(classID)) {
        return cache[classID];
    }
    else {
        const response = await axios.get(`http://140.128.156.92/AACourses/Web/qVT.php?F_sPeriodsem=${year}&eID=${classID}`);
        if (response.status === 200) {
            const $ = load(response.data);
            const obj = {
                meet: $("#main > div:nth-child(3) > a").html() ? $("#main > div:nth-child(3) > a").html().replace(/ /g, "") : "",
                classroom: $("#main > div:nth-child(5)").html() ? $("#main > div:nth-child(5)").html() : ""
            };
            cache[classID] = obj;
            return obj;
        }
        else {
            throw new Error("Error during getting VT");
        };
    };
}