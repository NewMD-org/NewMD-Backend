import fetch from 'node-fetch';
import axios from 'axios';
import iconv from 'iconv-lite';
import cheerio from 'cheerio';
import cls from './function.js';

async function getSchedule(className, year, week) {
    let data = new Object();

    const pwd = process.env.UserPsd;
    const id = process.env.UserName;
    let url = "";
    let hasF_sPeriodsem = true;

    console.log("className: " + className);
    console.log("year: " + year);
    console.log("week: " + week);

    if (year && week && className) {
        if ((typeof (className) == "string") && (typeof (week) == "number") && (typeof (year) == "number")) {
            if (((className.length <= 4) && (week.toString().length <= 2) && year.toString().length == 4)) {
                let classSymbol = cls(className);
                if (classSymbol.err) {
                    data.error = `ClassError: class ${className} is not found`;
                    return data;
                }
                url = `?F_sPeriodsem=${year}&F_wno=${week}&qType=Class&F_sClass=${classSymbol.output}`;
            }
            else {
                data.error = "ParamsError: input string length is not in order";
                console.log(data.error);
                return data;
            }
        }
        else {
            data.error = "TypeError: input type is not in order";
            console.log(data.error);
            return data;
        }
    }
    else if (!className || !week || !year) {
        if (className && !(typeof week !== 'undefined') && !(typeof year !== 'undefined')) {
            year = "";
            week = "";
            hasF_sPeriodsem = false;
            let classSymbol = cls(className);
            if (classSymbol.err) {
                data.error = `ClassError: class ${className} is not found`;
                return data;
            }
            url = `?qType=Class&F_sClass=${classSymbol.output}`;
        } else if (className && !(typeof week !== 'undefined') && year) {
            hasF_sPeriodsem = false;
            let classSymbol = cls(className);
            if (classSymbol.err) {
                data.error = `ClassError: class ${className} is not found`;
                return data;
            }
            url = `?F_sPeriodsem=${year}&qType=Class&F_sClass=${classSymbol.output}`;
        }
        else {
            data.error = "InputError";
            console.log(data.error);
            return data;
        };
    }
    else {
        data.error = "error4";
        console.log(data.error);
        return data;
    }

    data = await fetch("http://libauto.mingdao.edu.tw/AACourses/Web/wLogin.php", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "zh-TW,zh;q=0.9",
            "upgrade-insecure-requests": "1"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
    }).then(response => {
        let status = Object.getOwnPropertySymbols(response).map(item => response[item])[1].status;
        let setCookie = Object.getOwnPropertySymbols(response).map(item => response[item])[1].headers.get('set-cookie');
        if (status == 200) {
            return setCookie.split(';')[0];
        }
        else {
            return "network error 1";
        };
    }).then(async cookie => {
        if (cookie == "network error 1") {
            return {
                error: cookie
            };
        }
        else {
            let data = await fetch("http://libauto.mingdao.edu.tw/AACourses/Web/wLogin.php", {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "zh-TW,zh;q=0.9",
                    "cache-control": "max-age=0",
                    "content-type": "application/x-www-form-urlencoded",
                    "upgrade-insecure-requests": "1",
                    "cookie": cookie,
                    "Referer": "http://libauto.mingdao.edu.tw/AACourses/Web/wLogin.php",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": `sureReg=YES&goURL=qWTT.php&accessWay=ACCOUNT&HTTP_REFERER=&wRole=STD&stdID=${id}&stdPWD=${pwd}&uRFID=&Submit=%BDT%A9w%B5n%A4J`,
                "method": "POST"
            }).then(response => {
                let status = Object.getOwnPropertySymbols(response).map(item => response[item])[1].status;
                if (status == 200) {
                    return cookie;
                }
                else {
                    return "network error 2";
                };
            }).then(async cookie => {
                if (cookie == "network error 2") {
                    return {
                        error: cookie
                    };
                }
                else {
                    let mode = hasF_sPeriodsem ? 'qWTT' : 'qSTT';
                    let data = await axios.request({
                        responseType: 'arraybuffer',
                        method: "GET",
                        url: `http://libauto.mingdao.edu.tw/AACourses/Web/${mode}.php${url}`,
                        headers: {
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                            "accept-language": "zh-TW,zh;q=0.9",
                            "cache-control": "max-age=0",
                            "upgrade-insecure-requests": "1",
                            "cookie": cookie
                        },
                        transformResponse: [data => {
                            return iconv.decode(Buffer.from(data), 'big5');
                        }]
                    }).then(response => {
                        let data;
                        if (response.status == 200) {
                            const $ = cheerio.load(response.data);
                            let location = " > table > tbody > tr > td > span > div > div.";
                            data = {
                                day1: {
                                    1: {
                                        classname: `${$(`#F_1_1${location}subj`).html()}`,
                                        teacher: `${$(`#F_1_1${location}tea`).html()}`
                                    },
                                    2: {
                                        classname: `${$(`#F_1_2${location}subj`).html()}`,
                                        teacher: `${$(`#F_1_2${location}tea`).html()}`
                                    },
                                    3: {
                                        classname: `${$(`#F_1_3${location}subj`).html()}`,
                                        teacher: `${$(`#F_1_3${location}tea`).html()}`
                                    },
                                    4: {
                                        classname: `${$(`#F_1_4${location}subj`).html()}`,
                                        teacher: `${$(`#F_1_4${location}tea`).html()}`
                                    },
                                    5: {
                                        classname: `${$(`#F_1_5${location}subj`).html()}`,
                                        teacher: `${$(`#F_1_5${location}tea`).html()}`
                                    },
                                    6: {
                                        classname: `${$(`#F_1_6${location}subj`).html()}`,
                                        teacher: `${$(`#F_1_6${location}tea`).html()}`
                                    },
                                    7: {
                                        classname: `${$(`#F_1_7${location}subj`).html()}`,
                                        teacher: `${$(`#F_1_7${location}tea`).html()}`
                                    },
                                    8: {
                                        classname: `${$(`#F_1_8${location}subj`).html()}`,
                                        teacher: `${$(`#F_1_8${location}tea`).html()}`
                                    }
                                },
                                day2: {
                                    1: {
                                        classname: `${$(`#F_2_1${location}subj`).html()}`,
                                        teacher: `${$(`#F_2_1${location}tea`).html()}`
                                    },
                                    2: {
                                        classname: `${$(`#F_2_2${location}subj`).html()}`,
                                        teacher: `${$(`#F_2_2${location}tea`).html()}`
                                    },
                                    3: {
                                        classname: `${$(`#F_2_3${location}subj`).html()}`,
                                        teacher: `${$(`#F_2_3${location}tea`).html()}`
                                    },
                                    4: {
                                        classname: `${$(`#F_2_4${location}subj`).html()}`,
                                        teacher: `${$(`#F_2_4${location}tea`).html()}`
                                    },
                                    5: {
                                        classname: `${$(`#F_2_5${location}subj`).html()}`,
                                        teacher: `${$(`#F_2_5${location}tea`).html()}`
                                    },
                                    6: {
                                        classname: `${$(`#F_2_6${location}subj`).html()}`,
                                        teacher: `${$(`#F_2_6${location}tea`).html()}`
                                    },
                                    7: {
                                        classname: `${$(`#F_2_7${location}subj`).html()}`,
                                        teacher: `${$(`#F_2_7${location}tea`).html()}`
                                    },
                                    8: {
                                        classname: `${$(`#F_2_8${location}subj`).html()}`,
                                        teacher: `${$(`#F_2_8${location}tea`).html()}`
                                    }
                                },
                                day3: {
                                    1: {
                                        classname: `${$(`#F_3_1${location}subj`).html()}`,
                                        teacher: `${$(`#F_3_1${location}tea`).html()}`
                                    },
                                    2: {
                                        classname: `${$(`#F_3_2${location}subj`).html()}`,
                                        teacher: `${$(`#F_3_2${location}tea`).html()}`
                                    },
                                    3: {
                                        classname: `${$(`#F_3_3${location}subj`).html()}`,
                                        teacher: `${$(`#F_3_3${location}tea`).html()}`
                                    },
                                    4: {
                                        classname: `${$(`#F_3_4${location}subj`).html()}`,
                                        teacher: `${$(`#F_3_4${location}tea`).html()}`
                                    },
                                    5: {
                                        classname: `${$(`#F_3_5${location}subj`).html()}`,
                                        teacher: `${$(`#F_3_5${location}tea`).html()}`
                                    },
                                    6: {
                                        classname: `${$(`#F_3_6${location}subj`).html()}`,
                                        teacher: `${$(`#F_3_6${location}tea`).html()}`
                                    },
                                    7: {
                                        classname: `${$(`#F_3_7${location}subj`).html()}`,
                                        teacher: `${$(`#F_3_7${location}tea`).html()}`
                                    },
                                    8: {
                                        classname: `${$(`#F_3_8${location}subj`).html()}`,
                                        teacher: `${$(`#F_3_8${location}tea`).html()}`
                                    }
                                },
                                day4: {
                                    1: {
                                        classname: `${$(`#F_4_1${location}subj`).html()}`,
                                        teacher: `${$(`#F_4_1${location}tea`).html()}`
                                    },
                                    2: {
                                        classname: `${$(`#F_4_2${location}subj`).html()}`,
                                        teacher: `${$(`#F_4_2${location}tea`).html()}`
                                    },
                                    3: {
                                        classname: `${$(`#F_4_3${location}subj`).html()}`,
                                        teacher: `${$(`#F_4_3${location}tea`).html()}`
                                    },
                                    4: {
                                        classname: `${$(`#F_4_4${location}subj`).html()}`,
                                        teacher: `${$(`#F_4_4${location}tea`).html()}`
                                    },
                                    5: {
                                        classname: `${$(`#F_4_5${location}subj`).html()}`,
                                        teacher: `${$(`#F_4_5${location}tea`).html()}`
                                    },
                                    6: {
                                        classname: `${$(`#F_4_6${location}subj`).html()}`,
                                        teacher: `${$(`#F_4_6${location}tea`).html()}`
                                    },
                                    7: {
                                        classname: `${$(`#F_4_7${location}subj`).html()}`,
                                        teacher: `${$(`#F_4_7${location}tea`).html()}`
                                    },
                                    8: {
                                        classname: `${$(`#F_4_8${location}subj`).html()}`,
                                        teacher: `${$(`#F_4_8${location}tea`).html()}`
                                    }
                                },
                                day5: {
                                    1: {
                                        classname: `${$(`#F_5_1${location}subj`).html()}`,
                                        teacher: `${$(`#F_5_1${location}tea`).html()}`
                                    },
                                    2: {
                                        classname: `${$(`#F_5_2${location}subj`).html()}`,
                                        teacher: `${$(`#F_5_2${location}tea`).html()}`
                                    },
                                    3: {
                                        classname: `${$(`#F_5_3${location}subj`).html()}`,
                                        teacher: `${$(`#F_5_3${location}tea`).html()}`
                                    },
                                    4: {
                                        classname: `${$(`#F_5_4${location}subj`).html()}`,
                                        teacher: `${$(`#F_5_4${location}tea`).html()}`
                                    },
                                    5: {
                                        classname: `${$(`#F_5_5${location}subj`).html()}`,
                                        teacher: `${$(`#F_5_5${location}tea`).html()}`
                                    },
                                    6: {
                                        classname: `${$(`#F_5_6${location}subj`).html()}`,
                                        teacher: `${$(`#F_5_6${location}tea`).html()}`
                                    },
                                    7: {
                                        classname: `${$(`#F_5_7${location}subj`).html()}`,
                                        teacher: `${$(`#F_5_7${location}tea`).html()}`
                                    },
                                    8: {
                                        classname: `${$(`#F_5_8${location}subj`).html()}`,
                                        teacher: `${$(`#F_5_8${location}tea`).html()}`
                                    }
                                },
                                day6: {
                                    1: {
                                        classname: `${$(`#F_6_1${location}subj`).html()}`,
                                        teacher: `${$(`#F_6_1${location}tea`).html()}`
                                    },
                                    2: {
                                        classname: `${$(`#F_6_2${location}subj`).html()}`,
                                        teacher: `${$(`#F_6_2${location}tea`).html()}`
                                    },
                                    3: {
                                        classname: `${$(`#F_6_3${location}subj`).html()}`,
                                        teacher: `${$(`#F_6_3${location}tea`).html()}`
                                    },
                                    4: {
                                        classname: `${$(`#F_6_4${location}subj`).html()}`,
                                        teacher: `${$(`#F_6_4${location}tea`).html()}`
                                    },
                                    5: {
                                        classname: `${$(`#F_6_5${location}subj`).html()}`,
                                        teacher: `${$(`#F_6_5${location}tea`).html()}`
                                    },
                                    6: {
                                        classname: `${$(`#F_6_6${location}subj`).html()}`,
                                        teacher: `${$(`#F_6_6${location}tea`).html()}`
                                    },
                                    7: {
                                        classname: `${$(`#F_6_7${location}subj`).html()}`,
                                        teacher: `${$(`#F_6_7${location}tea`).html()}`
                                    },
                                    8: {
                                        classname: `${$(`#F_6_8${location}subj`).html()}`,
                                        teacher: `${$(`#F_6_8${location}tea`).html()}`
                                    }
                                },
                            };
                            return data;
                        }
                        else {
                            return {
                                error: "network error 3"
                            };
                        };
                    }).catch(_ => {
                        return {
                            error: "network error 3"
                        };
                    });
                    return data;
                };
            }).catch(_ => {
                return {
                    error: "network error 2"
                };
            });
            return data;
        };
    }).catch(_ => {
        let data = {
            error: "network error 1"
        };
        return data;
    });
    return data;
}


/*
1 > 上學期
2 > 下學期
3 > 暑假
4 > 寒假
*/

// getSchedule("Y313", 1101, 1).then(data => {
//     if (!data.error) {
//         console.log(data);
//     }
//     else {
//         console.error(data.error);
//     };
// });

export default getSchedule;