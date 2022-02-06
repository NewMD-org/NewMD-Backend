import 'dotenv/config'
import { readFileSync, writeFileSync } from 'fs';
import fetch from 'node-fetch';
import axios from 'axios';
import iconv from 'iconv-lite';
import cheerio from 'cheerio';
import cls from './function.js';

class timetable {
    /**
     * timetable class constructor
     * @param { string } className 
     * @param { number } year 
     * @param { number } week 
     */
    constructor(className, year, week) {
        this.className = className;
        this.year = year;
        this.week = week;
        this.detail = className + String(year) + String(week);
        this.classSymbol = '';
        this.res = {};
        this.url = '';
    }

    urlProcess() {
        const className = this.className;
        const year = this.year;
        const week = this.week;
        if (year && week && className) {
            if ((typeof (className) == "string") && (typeof (week) == "number") && (typeof (year) == "number")) {
                if (((className.length <= 4) && (week.toString().length <= 2) && year.toString().length == 4)) {
                    let classSymbol = cls(className);
                    if (classSymbol.err) {
                        this.res = {
                            error: `ClassError: class ${className} is not found`
                        };
                    }
                    this.classSymbol = classSymbol.output;
                    this.url = `?F_sPeriodsem=${year}&F_wno=${week}&qType=Class&F_sClass=${classSymbol.output}`;
                }
                else {
                    this.res = { error: "ParamsError: input string length is not in order" };
                }
            }
            else {
                this.res = { error: "TypeError: input type is not in order" };
            }
        } else if (!className || !week || !year) {
            if (className && !(typeof week !== 'undefined') && !(typeof year !== 'undefined')) {
                this.hasF_sPeriodsem = false;
                let classSymbol = cls(className);
                if (classSymbol.err) {
                    this.res = { error: `ClassError: class ${className} is not found` };
                }
                this.classSymbol = classSymbol.output;
                this.url = `?qType=Class&F_sClass=${classSymbol.output}`;
            } else if (className && !(typeof week !== 'undefined') && year) {
                this.hasF_sPeriodsem = false;
                let classSymbol = cls(className);
                if (classSymbol.err) {
                    this.res = {
                        error: `ClassError: class ${className} is not found`
                    }
                }
                this.classSymbol = classSymbol.output;
                this.url = `?F_sPeriodsem=${year}&qType=Class&F_sClass=${classSymbol.output}`;
            }
            else {
                this.res = { error: 'Input error' };
            };
        } else {
            this.res = { error: 'didn\'t input params' };
        }
    }

    checkCache() {
        const res = readFileSync('./data/data.json');
        // @ts-ignore
        let data = JSON.parse(res);
        let has_log = false;
        data.forEach(index => {
            if (index[0] == this.detail) {
                index[1]++;
                this.res = index[2];
                has_log = true;
            }
        });
        if (has_log) {
            writeFileSync('./data/data.json', JSON.stringify(data));
            return {
                status: 1,
                data: this.res
            }
        } else {
            return {
                status: 0
            }
        }
    }

    outCacheUp(object) {
        const res = readFileSync('./data/data.json');
        const data = JSON.parse(res);
        if (data.length == 10) {
            let min = data[0][1], minIndex = 0;
            for (let i = 1; i < 10; i++) {
                let tmp = data[i][1];
                if (tmp < min) {
                    min = tmp;
                    minIndex = i;
                };
            }
            data.splice(minIndex, 1);
            data.push(object);
            writeFileSync('./data/data.json', JSON.stringify(data));
        } else {
            data.push(object);
            writeFileSync('./data/data.json', JSON.stringify(data));
        }
    }

    get GET_RES() {
        return this.res;
    }

    async getTable() {
        const id = process.env.UserId;
        const password = process.env.UserPsd;
        this.urlProcess();
        if (this.res.error) {
            return this.res.error;
        }
        try {
            let response = await fetch("http://libauto.mingdao.edu.tw/AACourses/Web/wLogin.php", {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "zh-TW,zh;q=0.9",
                    "upgrade-insecure-requests": "1"
                },
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET"
            });
            let status = Object.getOwnPropertySymbols(response).map(item => response[item])[1].status;
            let setCookie = Object.getOwnPropertySymbols(response).map(item => response[item])[1].headers.get('set-cookie');
            if (status != 200) return this.res = { error: 'network error' };
            const cookie = setCookie.split(';')[0];
            let login = await fetch("http://libauto.mingdao.edu.tw/AACourses/Web/wLogin.php", {
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
                "body": `sureReg=YES&goURL=qWTT.php&accessWay=ACCOUNT&HTTP_REFERER=&wRole=STD&stdID=${id}&stdPWD=${password}&uRFID=&Submit=%BDT%A9w%B5n%A4J`,
                "method": "POST"
            });
            status = Object.getOwnPropertySymbols(login).map(item => login[item])[1].status;
            if (status !== 200) {
                return this.res = { error: 'network error' };
            }
            let mode = this.hasF_sPeriodsem ? 'qWTT' : 'qSTT';
            let page;
            await axios.request({
                responseType: 'arraybuffer',
                method: "GET",
                url: `http://libauto.mingdao.edu.tw/AACourses/Web/${mode}.php${this.url}`,
                headers: {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "zh-TW,zh;q=0.9",
                    "cache-control": "max-age=0",
                    "upgrade-insecure-requests": "1",
                    "cookie": cookie
                },
                transformResponse: [data => {
                    page = iconv.decode(Buffer.from(data), 'big5');
                }]
            });
            let data;
            const $ = cheerio.load(page);
            let location = " > table > tbody > tr > td > span > div > div.";
            data = {
                day1: {
                    1: {
                        classname: $(`#F_1_1${location}subj`).html(),
                        teacher: $(`#F_1_1${location}tea`).html()
                    },
                    2: {
                        classname: $(`#F_1_2${location}subj`).html(),
                        teacher: $(`#F_1_2${location}tea`).html()
                    },
                    3: {
                        classname: $(`#F_1_3${location}subj`).html(),
                        teacher: $(`#F_1_3${location}tea`).html()
                    },
                    4: {
                        classname: $(`#F_1_4${location}subj`).html(),
                        teacher: $(`#F_1_4${location}tea`).html()
                    },
                    5: {
                        classname: $(`#F_1_5${location}subj`).html(),
                        teacher: $(`#F_1_5${location}tea`).html()
                    },
                    6: {
                        classname: $(`#F_1_6${location}subj`).html(),
                        teacher: $(`#F_1_6${location}tea`).html()
                    },
                    7: {
                        classname: $(`#F_1_7${location}subj`).html(),
                        teacher: $(`#F_1_7${location}tea`).html()
                    },
                    8: {
                        classname: $(`#F_1_8${location}subj`).html(),
                        teacher: $(`#F_1_8${location}tea`).html()
                    }
                },
                day2: {
                    1: {
                        classname: $(`#F_2_1${location}subj`).html(),
                        teacher: $(`#F_2_1${location}tea`).html()
                    },
                    2: {
                        classname: $(`#F_2_2${location}subj`).html(),
                        teacher: $(`#F_2_2${location}tea`).html()
                    },
                    3: {
                        classname: $(`#F_2_3${location}subj`).html(),
                        teacher: $(`#F_2_3${location}tea`).html()
                    },
                    4: {
                        classname: $(`#F_2_4${location}subj`).html(),
                        teacher: $(`#F_2_4${location}tea`).html()
                    },
                    5: {
                        classname: $(`#F_2_5${location}subj`).html(),
                        teacher: $(`#F_2_5${location}tea`).html()
                    },
                    6: {
                        classname: $(`#F_2_6${location}subj`).html(),
                        teacher: $(`#F_2_6${location}tea`).html()
                    },
                    7: {
                        classname: $(`#F_2_7${location}subj`).html(),
                        teacher: $(`#F_2_7${location}tea`).html()
                    },
                    8: {
                        classname: $(`#F_2_8${location}subj`).html(),
                        teacher: $(`#F_2_8${location}tea`).html()
                    }
                },
                day3: {
                    1: {
                        classname: $(`#F_3_1${location}subj`).html(),
                        teacher: $(`#F_3_1${location}tea`).html()
                    },
                    2: {
                        classname: $(`#F_3_2${location}subj`).html(),
                        teacher: $(`#F_3_2${location}tea`).html()
                    },
                    3: {
                        classname: $(`#F_3_3${location}subj`).html(),
                        teacher: $(`#F_3_3${location}tea`).html()
                    },
                    4: {
                        classname: $(`#F_3_4${location}subj`).html(),
                        teacher: $(`#F_3_4${location}tea`).html()
                    },
                    5: {
                        classname: $(`#F_3_5${location}subj`).html(),
                        teacher: $(`#F_3_5${location}tea`).html()
                    },
                    6: {
                        classname: $(`#F_3_6${location}subj`).html(),
                        teacher: $(`#F_3_6${location}tea`).html()
                    },
                    7: {
                        classname: $(`#F_3_7${location}subj`).html(),
                        teacher: $(`#F_3_7${location}tea`).html()
                    },
                    8: {
                        classname: $(`#F_3_8${location}subj`).html(),
                        teacher: $(`#F_3_8${location}tea`).html()
                    }
                },
                day4: {
                    1: {
                        classname: $(`#F_4_1${location}subj`).html(),
                        teacher: $(`#F_4_1${location}tea`).html()
                    },
                    2: {
                        classname: $(`#F_4_2${location}subj`).html(),
                        teacher: $(`#F_4_2${location}tea`).html()
                    },
                    3: {
                        classname: $(`#F_4_3${location}subj`).html(),
                        teacher: $(`#F_4_3${location}tea`).html()
                    },
                    4: {
                        classname: $(`#F_4_4${location}subj`).html(),
                        teacher: $(`#F_4_4${location}tea`).html()
                    },
                    5: {
                        classname: $(`#F_4_5${location}subj`).html(),
                        teacher: $(`#F_4_5${location}tea`).html()
                    },
                    6: {
                        classname: $(`#F_4_6${location}subj`).html(),
                        teacher: $(`#F_4_6${location}tea`).html()
                    },
                    7: {
                        classname: $(`#F_4_7${location}subj`).html(),
                        teacher: $(`#F_4_7${location}tea`).html()
                    },
                    8: {
                        classname: $(`#F_4_8${location}subj`).html(),
                        teacher: $(`#F_4_8${location}tea`).html()
                    }
                },
                day5: {
                    1: {
                        classname: $(`#F_5_1${location}subj`).html(),
                        teacher: $(`#F_5_1${location}tea`).html()
                    },
                    2: {
                        classname: $(`#F_5_2${location}subj`).html(),
                        teacher: $(`#F_5_2${location}tea`).html()
                    },
                    3: {
                        classname: $(`#F_5_3${location}subj`).html(),
                        teacher: $(`#F_5_3${location}tea`).html()
                    },
                    4: {
                        classname: $(`#F_5_4${location}subj`).html(),
                        teacher: $(`#F_5_4${location}tea`).html()
                    },
                    5: {
                        classname: $(`#F_5_5${location}subj`).html(),
                        teacher: $(`#F_5_5${location}tea`).html()
                    },
                    6: {
                        classname: $(`#F_5_6${location}subj`).html(),
                        teacher: $(`#F_5_6${location}tea`).html()
                    },
                    7: {
                        classname: $(`#F_5_7${location}subj`).html(),
                        teacher: $(`#F_5_7${location}tea`).html()
                    },
                    8: {
                        classname: $(`#F_5_8${location}subj`).html(),
                        teacher: $(`#F_5_8${location}tea`).html()
                    }
                },
                day6: {
                    1: {
                        classname: $(`#F_6_1${location}subj`).html(),
                        teacher: $(`#F_6_1${location}tea`).html()
                    },
                    2: {
                        classname: $(`#F_6_2${location}subj`).html(),
                        teacher: $(`#F_6_2${location}tea`).html()
                    },
                    3: {
                        classname: $(`#F_6_3${location}subj`).html(),
                        teacher: $(`#F_6_3${location}tea`).html()
                    },
                    4: {
                        classname: $(`#F_6_4${location}subj`).html(),
                        teacher: $(`#F_6_4${location}tea`).html()
                    },
                    5: {
                        classname: $(`#F_6_5${location}subj`).html(),
                        teacher: $(`#F_6_5${location}tea`).html()
                    },
                    6: {
                        classname: $(`#F_6_6${location}subj`).html(),
                        teacher: $(`#F_6_6${location}tea`).html()
                    },
                    7: {
                        classname: $(`#F_6_7${location}subj`).html(),
                        teacher: $(`#F_6_7${location}tea`).html()
                    },
                    8: {
                        classname: $(`#F_6_8${location}subj`).html(),
                        teacher: $(`#F_6_8${location}tea`).html()
                    }
                },
            };
            let writeData = [
                this.detail,
                1,
                data
            ];
            this.outCacheUp(writeData);
            this.res = data;
        } catch (err) {
            console.log('error:\n', err);
        }
    }
}

/**
 * Get Schedule by className, year?, week?
 * @param { string } className 
 * @param { number } year
 * @param { number } week
 */
export async function getSchedule(className, year, week) {
    let response = new timetable(className, year, week);
    const check = response.checkCache();
    if (check.status == 1) {
        return check.data;
    }
    await response.getTable();
    return response.GET_RES;
}

/*--------------Test--------------*/
// getSchedule('Y312', 1104)
//     .then(data => {
//         console.log(data);
//     }).catch(err => {
//         console.log('err:\n', err);
//     });
// getSchedule('Y38', 1102)
//     .then(data => {
//         console.log(data);
//     }).catch(err => {
//         console.log('err:\n', err);
//     });
getSchedule('X21', 1101, 8)
    .then(data => {
        console.log(data);
    }).catch(err => {
        console.log('err:\n', err);
    });
/*--------------Test--------------*/