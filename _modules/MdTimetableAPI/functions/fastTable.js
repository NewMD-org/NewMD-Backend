import fetch from "node-fetch";
import axios from "axios";
import iconv from "iconv-lite";
import { load } from "cheerio";


export async function fastTable(ID, PWD, timeout) {
    try {
        const firstResponse = await fetch(
            "http://140.128.156.92/AACourses/Web/wLogin.php",
            {
                timeout: timeout,
                "method": "GET"
            }
        );
        let firstResponse_setCookie = Object.getOwnPropertySymbols(firstResponse).map(item => firstResponse[item])[1].headers.get("set-cookie");
        let firstResponse_cookie;
        if (firstResponse.status == 200) {
            firstResponse_cookie = firstResponse_setCookie.split(";")[0];
        }
        else {
            throw new Error("fastTable : MD server error");
        }

        const loginResponse = await fetch(
            "http://140.128.156.92/AACourses/Web/wLogin.php",
            {
                timeout: timeout,
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "cookie": firstResponse_cookie
                },
                body: `sureReg=YES&goURL=qWTT.php&accessWay=ACCOUNT&wRole=STD&stdID=${ID}&stdPWD=${PWD}`,
                method: "POST"
            }
        );
        let loginResponse_cookie;
        if (loginResponse.url === "http://140.128.156.92/AACourses/Web/qWTT.php") {
            loginResponse_cookie = firstResponse_cookie;
        }
        else {
            throw new Error("fastTable : MD server error");
        }

        const getTableResponse = await axios.request(
            {
                timeout: timeout,
                "responseType": "arraybuffer",
                "method": "GET",
                "url": "http://140.128.156.92/AACourses/Web/qWTT.php",
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "zh-TW,zh;q=0.9",
                    "cache-control": "max-age=0",
                    "upgrade-insecure-requests": "1",
                    "cookie": loginResponse_cookie
                },
                "transformResponse": [data => {
                    // eslint-disable-next-line no-undef
                    return iconv.decode(Buffer.from(data), "big5");
                }]
            }
        );
        if (getTableResponse.status == 200) {
            const $ = load(getTableResponse.data);
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

                let table = {
                    day1: {
                        1: {
                            classname: $(`#F_1_1${location}subj`).html() ? $(`#F_1_1${location}subj`).html() : "",
                            teacher: $(`#F_1_1${location}tea`).html() ? $(`#F_1_1${location}tea`).html() : "",
                            classID: $(`#F_1_1${location}tea`).html() ? $(`#F_1_1${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        2: {
                            classname: $(`#F_1_2${location}subj`).html() ? $(`#F_1_2${location}subj`).html() : "",
                            teacher: $(`#F_1_2${location}tea`).html() ? $(`#F_1_2${location}tea`).html() : "",
                            classID: $(`#F_1_2${location}tea`).html() ? $(`#F_1_2${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        3: {
                            classname: $(`#F_1_3${location}subj`).html() ? $(`#F_1_3${location}subj`).html() : "",
                            teacher: $(`#F_1_3${location}tea`).html() ? $(`#F_1_3${location}tea`).html() : "",
                            classID: $(`#F_1_3${location}tea`).html() ? $(`#F_1_3${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        4: {
                            classname: $(`#F_1_4${location}subj`).html() ? $(`#F_1_4${location}subj`).html() : "",
                            teacher: $(`#F_1_4${location}tea`).html() ? $(`#F_1_4${location}tea`).html() : "",
                            classID: $(`#F_1_4${location}tea`).html() ? $(`#F_1_4${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        5: {
                            classname: $(`#F_1_5${location}subj`).html() ? $(`#F_1_5${location}subj`).html() : "",
                            teacher: $(`#F_1_5${location}tea`).html() ? $(`#F_1_5${location}tea`).html() : "",
                            classID: $(`#F_1_5${location}tea`).html() ? $(`#F_1_5${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        6: {
                            classname: $(`#F_1_6${location}subj`).html() ? $(`#F_1_6${location}subj`).html() : "",
                            teacher: $(`#F_1_6${location}tea`).html() ? $(`#F_1_6${location}tea`).html() : "",
                            classID: $(`#F_1_6${location}tea`).html() ? $(`#F_1_6${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        7: {
                            classname: $(`#F_1_7${location}subj`).html() ? $(`#F_1_7${location}subj`).html() : "",
                            teacher: $(`#F_1_7${location}tea`).html() ? $(`#F_1_7${location}tea`).html() : "",
                            classID: $(`#F_1_7${location}tea`).html() ? $(`#F_1_7${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        8: {
                            classname: $(`#F_1_8${location}subj`).html() ? $(`#F_1_8${location}subj`).html() : "",
                            teacher: $(`#F_1_8${location}tea`).html() ? $(`#F_1_8${location}tea`).html() : "",
                            classID: $(`#F_1_8${location}tea`).html() ? $(`#F_1_8${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                    },
                    day2: {
                        1: {
                            classname: $(`#F_2_1${location}subj`).html() ? $(`#F_2_1${location}subj`).html() : "",
                            teacher: $(`#F_2_1${location}tea`).html() ? $(`#F_2_1${location}tea`).html() : "",
                            classID: $(`#F_2_1${location}tea`).html() ? $(`#F_2_1${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        2: {
                            classname: $(`#F_2_2${location}subj`).html() ? $(`#F_2_2${location}subj`).html() : "",
                            teacher: $(`#F_2_2${location}tea`).html() ? $(`#F_2_2${location}tea`).html() : "",
                            classID: $(`#F_2_2${location}tea`).html() ? $(`#F_2_2${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        3: {
                            classname: $(`#F_2_3${location}subj`).html() ? $(`#F_2_3${location}subj`).html() : "",
                            teacher: $(`#F_2_3${location}tea`).html() ? $(`#F_2_3${location}tea`).html() : "",
                            classID: $(`#F_2_3${location}tea`).html() ? $(`#F_2_3${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        4: {
                            classname: $(`#F_2_4${location}subj`).html() ? $(`#F_2_4${location}subj`).html() : "",
                            teacher: $(`#F_2_4${location}tea`).html() ? $(`#F_2_4${location}tea`).html() : "",
                            classID: $(`#F_2_4${location}tea`).html() ? $(`#F_2_4${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        5: {
                            classname: $(`#F_2_5${location}subj`).html() ? $(`#F_2_5${location}subj`).html() : "",
                            teacher: $(`#F_2_5${location}tea`).html() ? $(`#F_2_5${location}tea`).html() : "",
                            classID: $(`#F_2_5${location}tea`).html() ? $(`#F_2_5${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        6: {
                            classname: $(`#F_2_6${location}subj`).html() ? $(`#F_2_6${location}subj`).html() : "",
                            teacher: $(`#F_2_6${location}tea`).html() ? $(`#F_2_6${location}tea`).html() : "",
                            classID: $(`#F_2_6${location}tea`).html() ? $(`#F_2_6${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        7: {
                            classname: $(`#F_2_7${location}subj`).html() ? $(`#F_2_7${location}subj`).html() : "",
                            teacher: $(`#F_2_7${location}tea`).html() ? $(`#F_2_7${location}tea`).html() : "",
                            classID: $(`#F_2_7${location}tea`).html() ? $(`#F_2_7${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        8: {
                            classname: $(`#F_2_8${location}subj`).html() ? $(`#F_2_8${location}subj`).html() : "",
                            teacher: $(`#F_2_8${location}tea`).html() ? $(`#F_2_8${location}tea`).html() : "",
                            classID: $(`#F_2_8${location}tea`).html() ? $(`#F_2_8${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                    },
                    day3: {
                        1: {
                            classname: $(`#F_3_1${location}subj`).html() ? $(`#F_3_1${location}subj`).html() : "",
                            teacher: $(`#F_3_1${location}tea`).html() ? $(`#F_3_1${location}tea`).html() : "",
                            classID: $(`#F_3_1${location}tea`).html() ? $(`#F_3_1${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        2: {
                            classname: $(`#F_3_2${location}subj`).html() ? $(`#F_3_2${location}subj`).html() : "",
                            teacher: $(`#F_3_2${location}tea`).html() ? $(`#F_3_2${location}tea`).html() : "",
                            classID: $(`#F_3_2${location}tea`).html() ? $(`#F_3_2${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        3: {
                            classname: $(`#F_3_3${location}subj`).html() ? $(`#F_3_3${location}subj`).html() : "",
                            teacher: $(`#F_3_3${location}tea`).html() ? $(`#F_3_3${location}tea`).html() : "",
                            classID: $(`#F_3_3${location}tea`).html() ? $(`#F_3_3${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        4: {
                            classname: $(`#F_3_4${location}subj`).html() ? $(`#F_3_4${location}subj`).html() : "",
                            teacher: $(`#F_3_4${location}tea`).html() ? $(`#F_3_4${location}tea`).html() : "",
                            classID: $(`#F_3_4${location}tea`).html() ? $(`#F_3_4${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        5: {
                            classname: $(`#F_3_5${location}subj`).html() ? $(`#F_3_5${location}subj`).html() : "",
                            teacher: $(`#F_3_5${location}tea`).html() ? $(`#F_3_5${location}tea`).html() : "",
                            classID: $(`#F_3_5${location}tea`).html() ? $(`#F_3_5${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        6: {
                            classname: $(`#F_3_6${location}subj`).html() ? $(`#F_3_6${location}subj`).html() : "",
                            teacher: $(`#F_3_6${location}tea`).html() ? $(`#F_3_6${location}tea`).html() : "",
                            classID: $(`#F_3_6${location}tea`).html() ? $(`#F_3_6${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        7: {
                            classname: $(`#F_3_7${location}subj`).html() ? $(`#F_3_7${location}subj`).html() : "",
                            teacher: $(`#F_3_7${location}tea`).html() ? $(`#F_3_7${location}tea`).html() : "",
                            classID: $(`#F_3_7${location}tea`).html() ? $(`#F_3_7${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        8: {
                            classname: $(`#F_3_8${location}subj`).html() ? $(`#F_3_8${location}subj`).html() : "",
                            teacher: $(`#F_3_8${location}tea`).html() ? $(`#F_3_8${location}tea`).html() : "",
                            classID: $(`#F_3_8${location}tea`).html() ? $(`#F_3_8${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                    },
                    day4: {
                        1: {
                            classname: $(`#F_4_1${location}subj`).html() ? $(`#F_4_1${location}subj`).html() : "",
                            teacher: $(`#F_4_1${location}tea`).html() ? $(`#F_4_1${location}tea`).html() : "",
                            classID: $(`#F_4_1${location}tea`).html() ? $(`#F_4_1${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        2: {
                            classname: $(`#F_4_2${location}subj`).html() ? $(`#F_4_2${location}subj`).html() : "",
                            teacher: $(`#F_4_2${location}tea`).html() ? $(`#F_4_2${location}tea`).html() : "",
                            classID: $(`#F_4_2${location}tea`).html() ? $(`#F_4_2${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        3: {
                            classname: $(`#F_4_3${location}subj`).html() ? $(`#F_4_3${location}subj`).html() : "",
                            teacher: $(`#F_4_3${location}tea`).html() ? $(`#F_4_3${location}tea`).html() : "",
                            classID: $(`#F_4_3${location}tea`).html() ? $(`#F_4_3${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        4: {
                            classname: $(`#F_4_4${location}subj`).html() ? $(`#F_4_4${location}subj`).html() : "",
                            teacher: $(`#F_4_4${location}tea`).html() ? $(`#F_4_4${location}tea`).html() : "",
                            classID: $(`#F_4_4${location}tea`).html() ? $(`#F_4_4${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        5: {
                            classname: $(`#F_4_5${location}subj`).html() ? $(`#F_4_5${location}subj`).html() : "",
                            teacher: $(`#F_4_5${location}tea`).html() ? $(`#F_4_5${location}tea`).html() : "",
                            classID: $(`#F_4_5${location}tea`).html() ? $(`#F_4_5${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        6: {
                            classname: $(`#F_4_6${location}subj`).html() ? $(`#F_4_6${location}subj`).html() : "",
                            teacher: $(`#F_4_6${location}tea`).html() ? $(`#F_4_6${location}tea`).html() : "",
                            classID: $(`#F_4_6${location}tea`).html() ? $(`#F_4_6${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        7: {
                            classname: $(`#F_4_7${location}subj`).html() ? $(`#F_4_7${location}subj`).html() : "",
                            teacher: $(`#F_4_7${location}tea`).html() ? $(`#F_4_7${location}tea`).html() : "",
                            classID: $(`#F_4_7${location}tea`).html() ? $(`#F_4_7${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        8: {
                            classname: $(`#F_4_8${location}subj`).html() ? $(`#F_4_8${location}subj`).html() : "",
                            teacher: $(`#F_4_8${location}tea`).html() ? $(`#F_4_8${location}tea`).html() : "",
                            classID: $(`#F_4_8${location}tea`).html() ? $(`#F_4_8${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                    },
                    day5: {
                        1: {
                            classname: $(`#F_5_1${location}subj`).html() ? $(`#F_5_1${location}subj`).html() : "",
                            teacher: $(`#F_5_1${location}tea`).html() ? $(`#F_5_1${location}tea`).html() : "",
                            classID: $(`#F_5_1${location}tea`).html() ? $(`#F_5_1${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        2: {
                            classname: $(`#F_5_2${location}subj`).html() ? $(`#F_5_2${location}subj`).html() : "",
                            teacher: $(`#F_5_2${location}tea`).html() ? $(`#F_5_2${location}tea`).html() : "",
                            classID: $(`#F_5_2${location}tea`).html() ? $(`#F_5_2${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        3: {
                            classname: $(`#F_5_3${location}subj`).html() ? $(`#F_5_3${location}subj`).html() : "",
                            teacher: $(`#F_5_3${location}tea`).html() ? $(`#F_5_3${location}tea`).html() : "",
                            classID: $(`#F_5_3${location}tea`).html() ? $(`#F_5_3${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        4: {
                            classname: $(`#F_5_4${location}subj`).html() ? $(`#F_5_4${location}subj`).html() : "",
                            teacher: $(`#F_5_4${location}tea`).html() ? $(`#F_5_4${location}tea`).html() : "",
                            classID: $(`#F_5_4${location}tea`).html() ? $(`#F_5_4${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        5: {
                            classname: $(`#F_5_5${location}subj`).html() ? $(`#F_5_5${location}subj`).html() : "",
                            teacher: $(`#F_5_5${location}tea`).html() ? $(`#F_5_5${location}tea`).html() : "",
                            classID: $(`#F_5_5${location}tea`).html() ? $(`#F_5_5${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        6: {
                            classname: $(`#F_5_6${location}subj`).html() ? $(`#F_5_6${location}subj`).html() : "",
                            teacher: $(`#F_5_6${location}tea`).html() ? $(`#F_5_6${location}tea`).html() : "",
                            classID: $(`#F_5_6${location}tea`).html() ? $(`#F_5_6${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        7: {
                            classname: $(`#F_5_7${location}subj`).html() ? $(`#F_5_7${location}subj`).html() : "",
                            teacher: $(`#F_5_7${location}tea`).html() ? $(`#F_5_7${location}tea`).html() : "",
                            classID: $(`#F_5_7${location}tea`).html() ? $(`#F_5_7${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        8: {
                            classname: $(`#F_5_8${location}subj`).html() ? $(`#F_5_8${location}subj`).html() : "",
                            teacher: $(`#F_5_8${location}tea`).html() ? $(`#F_5_8${location}tea`).html() : "",
                            classID: $(`#F_5_8${location}tea`).html() ? $(`#F_5_8${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                    },
                    day6: {
                        1: {
                            classname: $(`#F_6_1${location}subj`).html() ? $(`#F_6_1${location}subj`).html() : "",
                            teacher: $(`#F_6_1${location}tea`).html() ? $(`#F_6_1${location}tea`).html() : "",
                            classID: $(`#F_6_1${location}tea`).html() ? $(`#F_6_1${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        2: {
                            classname: $(`#F_6_2${location}subj`).html() ? $(`#F_6_2${location}subj`).html() : "",
                            teacher: $(`#F_6_2${location}tea`).html() ? $(`#F_6_2${location}tea`).html() : "",
                            classID: $(`#F_6_2${location}tea`).html() ? $(`#F_6_2${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        3: {
                            classname: $(`#F_6_3${location}subj`).html() ? $(`#F_6_3${location}subj`).html() : "",
                            teacher: $(`#F_6_3${location}tea`).html() ? $(`#F_6_3${location}tea`).html() : "",
                            classID: $(`#F_6_3${location}tea`).html() ? $(`#F_6_3${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        4: {
                            classname: $(`#F_6_4${location}subj`).html() ? $(`#F_6_4${location}subj`).html() : "",
                            teacher: $(`#F_6_4${location}tea`).html() ? $(`#F_6_4${location}tea`).html() : "",
                            classID: $(`#F_6_4${location}tea`).html() ? $(`#F_6_4${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        5: {
                            classname: $(`#F_6_5${location}subj`).html() ? $(`#F_6_5${location}subj`).html() : "",
                            teacher: $(`#F_6_5${location}tea`).html() ? $(`#F_6_5${location}tea`).html() : "",
                            classID: $(`#F_6_5${location}tea`).html() ? $(`#F_6_5${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        6: {
                            classname: $(`#F_6_6${location}subj`).html() ? $(`#F_6_6${location}subj`).html() : "",
                            teacher: $(`#F_6_6${location}tea`).html() ? $(`#F_6_6${location}tea`).html() : "",
                            classID: $(`#F_6_6${location}tea`).html() ? $(`#F_6_6${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        7: {
                            classname: $(`#F_6_7${location}subj`).html() ? $(`#F_6_7${location}subj`).html() : "",
                            teacher: $(`#F_6_7${location}tea`).html() ? $(`#F_6_7${location}tea`).html() : "",
                            classID: $(`#F_6_7${location}tea`).html() ? $(`#F_6_7${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                        8: {
                            classname: $(`#F_6_8${location}subj`).html() ? $(`#F_6_8${location}subj`).html() : "",
                            teacher: $(`#F_6_8${location}tea`).html() ? $(`#F_6_8${location}tea`).html() : "",
                            classID: $(`#F_6_8${location}tea`).html() ? $(`#F_6_8${location}tea`).attr("onclick").replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                        },
                    },
                };

                return {
                    year,
                    grade,
                    selectedWeek,
                    table,
                    cookie: loginResponse_cookie
                };
            }
            catch (error) {
                throw new Error("fastTable : Error during getting table");
            }
        }
        else {
            throw new Error("fastTable : MD server error");
        }
    }
    catch (error) {
        throw new Error("fastTable : MD server error");
    }
}