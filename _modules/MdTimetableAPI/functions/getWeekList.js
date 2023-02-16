import axios from "axios";
import iconv from "iconv-lite";
import { load } from "cheerio";


export async function getWeekList(year, timeout) {
    try {
        const response = await axios.get(
            `http://140.128.156.92/AACourses/includes/ajax_fun.php?&F_sPeriodsem=${year}&Qtype=getWeekList`,
            {
                timeout: (timeout ? timeout : 20 * 1000),
                responseType: 'arraybuffer',
                "transformResponse": [data => {
                    // eslint-disable-next-line no-undef
                    return iconv.decode(Buffer.from(data), "big5");
                }]
            }
        );
        if (response.status === 200) {
            const $ = load(response.data);
            if (!$("body").text().includes("|")) {
                throw new Error("getWeekList : week list not found");
            } else {
                const listObj = {};
                const listArr = $("body").text().replace(/\|第.*?週 :/g, "").split(",").map(ele => [ele.split(" ")[0], ele.split(" ")[1]]);
                for (const key of listArr) {
                    listObj[key[0]] = key[1];
                }
                return listObj;
            }
        }
        else {
            throw new Error("getWeekList : MD server error");
        }
    }
    catch (error) {
        throw new Error(error);
    }
}