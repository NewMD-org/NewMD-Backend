import { load } from "cheerio";
import { getTable } from "./getTable.js";


export async function fastTable(ID, PWD, timeout) {
    const { tableHTML, cookie } = await getTable(ID, PWD, timeout);

    const $ = load(tableHTML);
    const location = " > table > tbody > tr > td > span > div > div.";

    if (!$("#UseInfo > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td.WB").text().includes("週課表")) {
        throw new Error("fastTable : MD server error");
    }

    try {
        let year;
        $("#F_sPeriodsem option").each((i, option) => {
            if (Object.keys($(option).attr()).includes("selected")) {
                year = $(option).attr().value;
            }
        });

        let grade = $("#qClass").attr().value;

        let selectedWeek = Number($("head > script:nth-child(19)").html().match(/'getWeekList','(.*?)'\);/)[1]);

        let table = {};
        for (let x = 1; x <= 6; x++) {
            table[`day${x}`] = {};
            for (let y = 1; y <= 8; y++) {
                table[`day${x}`][`${y}`] = {
                    classname: $(`#F_${x}_${y}${location}subj`).html() || "",
                    teacher: $(`#F_${x}_${y}${location}tea`).html() || "",
                    classID: $(`#F_${x}_${y}${location}tea`).html() ? $(`#F_${x}_${y}${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                    status: $(`#D_${x}_${y}`).html() || $(`#T_${x}_${y}`).html() || "",
                };
            }
        }

        return {
            year,
            grade,
            selectedWeek,
            table,
            cookie: cookie
        };
    }
    catch (error) {
        throw new Error("fastTable : Error during getting table");
    }
}