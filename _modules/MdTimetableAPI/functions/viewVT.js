import axios from "axios";
import cheerio from "cheerio";


export async function viewVT(year, classID, cache) {
    if (Object.keys(cache).includes(classID)) {
        return cache[classID];
    }
    else {
        const response = await axios.get(`http://libauto.mingdao.edu.tw/AACourses/Web/qVT.php?F_sPeriodsem=${year}&eID=${classID}`);
        if (response.status === 200) {
            const $ = cheerio.load(response.data);
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