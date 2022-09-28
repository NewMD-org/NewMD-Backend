import axios from "axios";
import cheerio from "cheerio";


export async function viewVT(year, eID) {
    let response = await axios.get(`http://libauto.mingdao.edu.tw/AACourses/Web/qVT.php?F_sPeriodsem=${year}&eID=${eID}`);
    if (response.status === 200) {
        let $ = cheerio.load(response.data);
        return {
            meet: $("#main > div:nth-child(3) > a").html().replace(/ /g, ""),
            classroom: $("#main > div:nth-child(5)").html()
        };
    }
    else {
        throw new Error("Error during getting VT");
    };
}