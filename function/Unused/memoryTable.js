// import 'dotenv/config'
import fetch from 'node-fetch';
import axios from 'axios';
import iconv from 'iconv-lite';
import cheerio from 'cheerio';
import { cls } from './function.js';
import dotenv from 'dotenv';

dotenv.config();

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

    get GET_RES() {
        return this.res;
    }

    async getTable() {
        const id = process.env.UserId;
        const pwd = process.env.UserPsd;
        this.urlProcess();
        if (this.res.error) {
            return this.res.error;
        }
        try {
            let firstResponse = await fetch("http://libauto.mingdao.edu.tw/AACourses/Web/wLogin.php", {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "zh-TW,zh;q=0.9",
                    "upgrade-insecure-requests": "1"
                },
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET"
            });
            let firstResponse_setCookie = Object.getOwnPropertySymbols(firstResponse).map(item => firstResponse[item])[1].headers.get('set-cookie');
            let firstResponse_cookie;
            if (firstResponse.status == 200) {
                firstResponse_cookie = firstResponse_setCookie.split(';')[0];
            }
            else {
                return this.res = { error: 'network error 1' };
            };

            let loginResponse = await fetch("http://libauto.mingdao.edu.tw/AACourses/Web/wLogin.php", {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "zh-TW,zh;q=0.9",
                    "cache-control": "max-age=0",
                    "content-type": "application/x-www-form-urlencoded",
                    "upgrade-insecure-requests": "1",
                    "cookie": firstResponse_cookie,
                    "Referer": "http://libauto.mingdao.edu.tw/AACourses/Web/wLogin.php",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": `sureReg=YES&goURL=qWTT.php&accessWay=ACCOUNT&HTTP_REFERER=&wRole=STD&stdID=${id}&stdPWD=${pwd}&uRFID=&Submit=%BDT%A9w%B5n%A4J`,
                "method": "POST"
            });
            let loginResponse_cookie;
            if (loginResponse.status == 200) {
                loginResponse_cookie = firstResponse_cookie;
            }
            else {
                return this.res = { error: 'network error 2' };
            };

            let mode = this.hasF_sPeriodsem ? 'qWTT' : 'qSTT';
            let getTableResponse = await axios.request({
                responseType: 'arraybuffer',
                method: "GET",
                url: `http://libauto.mingdao.edu.tw/AACourses/Web/${mode}.php${this.url}`,
                headers: {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "zh-TW,zh;q=0.9",
                    "cache-control": "max-age=0",
                    "upgrade-insecure-requests": "1",
                    "cookie": loginResponse_cookie
                },
                transformResponse: [data => {
                    return iconv.decode(Buffer.from(data), 'big5');
                }]
            });
            if (getTableResponse.status == 200) {
                const $ = cheerio.load(getTableResponse.data);
                let location = " > table > tbody > tr > td > span > div > div.";
                try {
                    let year;
                    $("#F_sPeriodsem option").each((i, option) => {
                        if (Object.keys($(option).attr()).includes("selected")) {
                            year = $(option).attr().value;
                        };
                    });

                    this.res = await view_VT(year, $(`#F_1_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""));

                    
                    let data = {
                        day1: {
                            1: {
                                classname: $(`#F_1_1${location}subj`).html() ? $(`#F_1_1${location}subj`).html() : "",
                                teacher: $(`#F_1_1${location}tea`).html() ? $(`#F_1_1${location}tea`).html() : "",
                                classID: $(`#F_1_1${location}tea`).html() ? $(`#F_1_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_1_1${location}tea`).html() ? (await view_VT(year, $(`#F_1_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_1_1${location}tea`).html() ? (await view_VT(year, $(`#F_1_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            2: {
                                classname: $(`#F_1_2${location}subj`).html() ? $(`#F_1_2${location}subj`).html() : "",
                                teacher: $(`#F_1_2${location}tea`).html() ? $(`#F_1_2${location}tea`).html() : "",
                                classID: $(`#F_1_2${location}tea`).html() ? $(`#F_1_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_1_2${location}tea`).html() ? (await view_VT(year, $(`#F_1_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_1_2${location}tea`).html() ? (await view_VT(year, $(`#F_1_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            3: {
                                classname: $(`#F_1_3${location}subj`).html() ? $(`#F_1_3${location}subj`).html() : "",
                                teacher: $(`#F_1_3${location}tea`).html() ? $(`#F_1_3${location}tea`).html() : "",
                                classID: $(`#F_1_3${location}tea`).html() ? $(`#F_1_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_1_3${location}tea`).html() ? (await view_VT(year, $(`#F_1_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_1_3${location}tea`).html() ? (await view_VT(year, $(`#F_1_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            4: {
                                classname: $(`#F_1_4${location}subj`).html() ? $(`#F_1_4${location}subj`).html() : "",
                                teacher: $(`#F_1_4${location}tea`).html() ? $(`#F_1_4${location}tea`).html() : "",
                                classID: $(`#F_1_4${location}tea`).html() ? $(`#F_1_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_1_4${location}tea`).html() ? (await view_VT(year, $(`#F_1_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_1_4${location}tea`).html() ? (await view_VT(year, $(`#F_1_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            5: {
                                classname: $(`#F_1_5${location}subj`).html() ? $(`#F_1_5${location}subj`).html() : "",
                                teacher: $(`#F_1_5${location}tea`).html() ? $(`#F_1_5${location}tea`).html() : "",
                                classID: $(`#F_1_5${location}tea`).html() ? $(`#F_1_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_1_5${location}tea`).html() ? (await view_VT(year, $(`#F_1_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_1_5${location}tea`).html() ? (await view_VT(year, $(`#F_1_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            6: {
                                classname: $(`#F_1_6${location}subj`).html() ? $(`#F_1_6${location}subj`).html() : "",
                                teacher: $(`#F_1_6${location}tea`).html() ? $(`#F_1_6${location}tea`).html() : "",
                                classID: $(`#F_1_6${location}tea`).html() ? $(`#F_1_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_1_6${location}tea`).html() ? (await view_VT(year, $(`#F_1_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_1_6${location}tea`).html() ? (await view_VT(year, $(`#F_1_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            7: {
                                classname: $(`#F_1_7${location}subj`).html() ? $(`#F_1_7${location}subj`).html() : "",
                                teacher: $(`#F_1_7${location}tea`).html() ? $(`#F_1_7${location}tea`).html() : "",
                                classID: $(`#F_1_7${location}tea`).html() ? $(`#F_1_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_1_7${location}tea`).html() ? (await view_VT(year, $(`#F_1_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_1_7${location}tea`).html() ? (await view_VT(year, $(`#F_1_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            8: {
                                classname: $(`#F_1_8${location}subj`).html() ? $(`#F_1_8${location}subj`).html() : "",
                                teacher: $(`#F_1_8${location}tea`).html() ? $(`#F_1_8${location}tea`).html() : "",
                                classID: $(`#F_1_8${location}tea`).html() ? $(`#F_1_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_1_8${location}tea`).html() ? (await view_VT(year, $(`#F_1_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_1_8${location}tea`).html() ? (await view_VT(year, $(`#F_1_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                        },
                        day2: {
                            1: {
                                classname: $(`#F_2_1${location}subj`).html() ? $(`#F_2_1${location}subj`).html() : "",
                                teacher: $(`#F_2_1${location}tea`).html() ? $(`#F_2_1${location}tea`).html() : "",
                                classID: $(`#F_2_1${location}tea`).html() ? $(`#F_2_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_2_1${location}tea`).html() ? (await view_VT(year, $(`#F_2_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_2_1${location}tea`).html() ? (await view_VT(year, $(`#F_2_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            2: {
                                classname: $(`#F_2_2${location}subj`).html() ? $(`#F_2_2${location}subj`).html() : "",
                                teacher: $(`#F_2_2${location}tea`).html() ? $(`#F_2_2${location}tea`).html() : "",
                                classID: $(`#F_2_2${location}tea`).html() ? $(`#F_2_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_2_2${location}tea`).html() ? (await view_VT(year, $(`#F_2_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_2_2${location}tea`).html() ? (await view_VT(year, $(`#F_2_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            3: {
                                classname: $(`#F_2_3${location}subj`).html() ? $(`#F_2_3${location}subj`).html() : "",
                                teacher: $(`#F_2_3${location}tea`).html() ? $(`#F_2_3${location}tea`).html() : "",
                                classID: $(`#F_2_3${location}tea`).html() ? $(`#F_2_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_2_3${location}tea`).html() ? (await view_VT(year, $(`#F_2_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_2_3${location}tea`).html() ? (await view_VT(year, $(`#F_2_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            4: {
                                classname: $(`#F_2_4${location}subj`).html() ? $(`#F_2_4${location}subj`).html() : "",
                                teacher: $(`#F_2_4${location}tea`).html() ? $(`#F_2_4${location}tea`).html() : "",
                                classID: $(`#F_2_4${location}tea`).html() ? $(`#F_2_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_2_4${location}tea`).html() ? (await view_VT(year, $(`#F_2_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_2_4${location}tea`).html() ? (await view_VT(year, $(`#F_2_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            5: {
                                classname: $(`#F_2_5${location}subj`).html() ? $(`#F_2_5${location}subj`).html() : "",
                                teacher: $(`#F_2_5${location}tea`).html() ? $(`#F_2_5${location}tea`).html() : "",
                                classID: $(`#F_2_5${location}tea`).html() ? $(`#F_2_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_2_5${location}tea`).html() ? (await view_VT(year, $(`#F_2_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_2_5${location}tea`).html() ? (await view_VT(year, $(`#F_2_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            6: {
                                classname: $(`#F_2_6${location}subj`).html() ? $(`#F_2_6${location}subj`).html() : "",
                                teacher: $(`#F_2_6${location}tea`).html() ? $(`#F_2_6${location}tea`).html() : "",
                                classID: $(`#F_2_6${location}tea`).html() ? $(`#F_2_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_2_6${location}tea`).html() ? (await view_VT(year, $(`#F_2_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_2_6${location}tea`).html() ? (await view_VT(year, $(`#F_2_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            7: {
                                classname: $(`#F_2_7${location}subj`).html() ? $(`#F_2_7${location}subj`).html() : "",
                                teacher: $(`#F_2_7${location}tea`).html() ? $(`#F_2_7${location}tea`).html() : "",
                                classID: $(`#F_2_7${location}tea`).html() ? $(`#F_2_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_2_7${location}tea`).html() ? (await view_VT(year, $(`#F_2_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_2_7${location}tea`).html() ? (await view_VT(year, $(`#F_2_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            8: {
                                classname: $(`#F_2_8${location}subj`).html() ? $(`#F_2_8${location}subj`).html() : "",
                                teacher: $(`#F_2_8${location}tea`).html() ? $(`#F_2_8${location}tea`).html() : "",
                                classID: $(`#F_2_8${location}tea`).html() ? $(`#F_2_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_2_8${location}tea`).html() ? (await view_VT(year, $(`#F_2_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_2_8${location}tea`).html() ? (await view_VT(year, $(`#F_2_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                        },
                        day3: {
                            1: {
                                classname: $(`#F_3_1${location}subj`).html() ? $(`#F_3_1${location}subj`).html() : "",
                                teacher: $(`#F_3_1${location}tea`).html() ? $(`#F_3_1${location}tea`).html() : "",
                                classID: $(`#F_3_1${location}tea`).html() ? $(`#F_3_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_3_1${location}tea`).html() ? (await view_VT(year, $(`#F_3_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_3_1${location}tea`).html() ? (await view_VT(year, $(`#F_3_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            2: {
                                classname: $(`#F_3_2${location}subj`).html() ? $(`#F_3_2${location}subj`).html() : "",
                                teacher: $(`#F_3_2${location}tea`).html() ? $(`#F_3_2${location}tea`).html() : "",
                                classID: $(`#F_3_2${location}tea`).html() ? $(`#F_3_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_3_2${location}tea`).html() ? (await view_VT(year, $(`#F_3_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_3_2${location}tea`).html() ? (await view_VT(year, $(`#F_3_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            3: {
                                classname: $(`#F_3_3${location}subj`).html() ? $(`#F_3_3${location}subj`).html() : "",
                                teacher: $(`#F_3_3${location}tea`).html() ? $(`#F_3_3${location}tea`).html() : "",
                                classID: $(`#F_3_3${location}tea`).html() ? $(`#F_3_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_3_3${location}tea`).html() ? (await view_VT(year, $(`#F_3_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_3_3${location}tea`).html() ? (await view_VT(year, $(`#F_3_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            4: {
                                classname: $(`#F_3_4${location}subj`).html() ? $(`#F_3_4${location}subj`).html() : "",
                                teacher: $(`#F_3_4${location}tea`).html() ? $(`#F_3_4${location}tea`).html() : "",
                                classID: $(`#F_3_4${location}tea`).html() ? $(`#F_3_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_3_4${location}tea`).html() ? (await view_VT(year, $(`#F_3_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_3_4${location}tea`).html() ? (await view_VT(year, $(`#F_3_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            5: {
                                classname: $(`#F_3_5${location}subj`).html() ? $(`#F_3_5${location}subj`).html() : "",
                                teacher: $(`#F_3_5${location}tea`).html() ? $(`#F_3_5${location}tea`).html() : "",
                                classID: $(`#F_3_5${location}tea`).html() ? $(`#F_3_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_3_5${location}tea`).html() ? (await view_VT(year, $(`#F_3_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_3_5${location}tea`).html() ? (await view_VT(year, $(`#F_3_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            6: {
                                classname: $(`#F_3_6${location}subj`).html() ? $(`#F_3_6${location}subj`).html() : "",
                                teacher: $(`#F_3_6${location}tea`).html() ? $(`#F_3_6${location}tea`).html() : "",
                                classID: $(`#F_3_6${location}tea`).html() ? $(`#F_3_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_3_6${location}tea`).html() ? (await view_VT(year, $(`#F_3_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_3_6${location}tea`).html() ? (await view_VT(year, $(`#F_3_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            7: {
                                classname: $(`#F_3_7${location}subj`).html() ? $(`#F_3_7${location}subj`).html() : "",
                                teacher: $(`#F_3_7${location}tea`).html() ? $(`#F_3_7${location}tea`).html() : "",
                                classID: $(`#F_3_7${location}tea`).html() ? $(`#F_3_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_3_7${location}tea`).html() ? (await view_VT(year, $(`#F_3_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_3_7${location}tea`).html() ? (await view_VT(year, $(`#F_3_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            8: {
                                classname: $(`#F_3_8${location}subj`).html() ? $(`#F_3_8${location}subj`).html() : "",
                                teacher: $(`#F_3_8${location}tea`).html() ? $(`#F_3_8${location}tea`).html() : "",
                                classID: $(`#F_3_8${location}tea`).html() ? $(`#F_3_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_3_8${location}tea`).html() ? (await view_VT(year, $(`#F_3_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_3_8${location}tea`).html() ? (await view_VT(year, $(`#F_3_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                        },
                        day4: {
                            1: {
                                classname: $(`#F_4_1${location}subj`).html() ? $(`#F_4_1${location}subj`).html() : "",
                                teacher: $(`#F_4_1${location}tea`).html() ? $(`#F_4_1${location}tea`).html() : "",
                                classID: $(`#F_4_1${location}tea`).html() ? $(`#F_4_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_4_1${location}tea`).html() ? (await view_VT(year, $(`#F_4_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_4_1${location}tea`).html() ? (await view_VT(year, $(`#F_4_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            2: {
                                classname: $(`#F_4_2${location}subj`).html() ? $(`#F_4_2${location}subj`).html() : "",
                                teacher: $(`#F_4_2${location}tea`).html() ? $(`#F_4_2${location}tea`).html() : "",
                                classID: $(`#F_4_2${location}tea`).html() ? $(`#F_4_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_4_2${location}tea`).html() ? (await view_VT(year, $(`#F_4_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_4_2${location}tea`).html() ? (await view_VT(year, $(`#F_4_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            3: {
                                classname: $(`#F_4_3${location}subj`).html() ? $(`#F_4_3${location}subj`).html() : "",
                                teacher: $(`#F_4_3${location}tea`).html() ? $(`#F_4_3${location}tea`).html() : "",
                                classID: $(`#F_4_3${location}tea`).html() ? $(`#F_4_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_4_3${location}tea`).html() ? (await view_VT(year, $(`#F_4_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_4_3${location}tea`).html() ? (await view_VT(year, $(`#F_4_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            4: {
                                classname: $(`#F_4_4${location}subj`).html() ? $(`#F_4_4${location}subj`).html() : "",
                                teacher: $(`#F_4_4${location}tea`).html() ? $(`#F_4_4${location}tea`).html() : "",
                                classID: $(`#F_4_4${location}tea`).html() ? $(`#F_4_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_4_4${location}tea`).html() ? (await view_VT(year, $(`#F_4_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_4_4${location}tea`).html() ? (await view_VT(year, $(`#F_4_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            5: {
                                classname: $(`#F_4_5${location}subj`).html() ? $(`#F_4_5${location}subj`).html() : "",
                                teacher: $(`#F_4_5${location}tea`).html() ? $(`#F_4_5${location}tea`).html() : "",
                                classID: $(`#F_4_5${location}tea`).html() ? $(`#F_4_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_4_5${location}tea`).html() ? (await view_VT(year, $(`#F_4_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_4_5${location}tea`).html() ? (await view_VT(year, $(`#F_4_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            6: {
                                classname: $(`#F_4_6${location}subj`).html() ? $(`#F_4_6${location}subj`).html() : "",
                                teacher: $(`#F_4_6${location}tea`).html() ? $(`#F_4_6${location}tea`).html() : "",
                                classID: $(`#F_4_6${location}tea`).html() ? $(`#F_4_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_4_6${location}tea`).html() ? (await view_VT(year, $(`#F_4_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_4_6${location}tea`).html() ? (await view_VT(year, $(`#F_4_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            7: {
                                classname: $(`#F_4_7${location}subj`).html() ? $(`#F_4_7${location}subj`).html() : "",
                                teacher: $(`#F_4_7${location}tea`).html() ? $(`#F_4_7${location}tea`).html() : "",
                                classID: $(`#F_4_7${location}tea`).html() ? $(`#F_4_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_4_7${location}tea`).html() ? (await view_VT(year, $(`#F_4_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_4_7${location}tea`).html() ? (await view_VT(year, $(`#F_4_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            8: {
                                classname: $(`#F_4_8${location}subj`).html() ? $(`#F_4_8${location}subj`).html() : "",
                                teacher: $(`#F_4_8${location}tea`).html() ? $(`#F_4_8${location}tea`).html() : "",
                                classID: $(`#F_4_8${location}tea`).html() ? $(`#F_4_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_4_8${location}tea`).html() ? (await view_VT(year, $(`#F_4_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_4_8${location}tea`).html() ? (await view_VT(year, $(`#F_4_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                        },
                        day5: {
                            1: {
                                classname: $(`#F_5_1${location}subj`).html() ? $(`#F_5_1${location}subj`).html() : "",
                                teacher: $(`#F_5_1${location}tea`).html() ? $(`#F_5_1${location}tea`).html() : "",
                                classID: $(`#F_5_1${location}tea`).html() ? $(`#F_5_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_5_1${location}tea`).html() ? (await view_VT(year, $(`#F_5_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_5_1${location}tea`).html() ? (await view_VT(year, $(`#F_5_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            2: {
                                classname: $(`#F_5_2${location}subj`).html() ? $(`#F_5_2${location}subj`).html() : "",
                                teacher: $(`#F_5_2${location}tea`).html() ? $(`#F_5_2${location}tea`).html() : "",
                                classID: $(`#F_5_2${location}tea`).html() ? $(`#F_5_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_5_2${location}tea`).html() ? (await view_VT(year, $(`#F_5_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_5_2${location}tea`).html() ? (await view_VT(year, $(`#F_5_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            3: {
                                classname: $(`#F_5_3${location}subj`).html() ? $(`#F_5_3${location}subj`).html() : "",
                                teacher: $(`#F_5_3${location}tea`).html() ? $(`#F_5_3${location}tea`).html() : "",
                                classID: $(`#F_5_3${location}tea`).html() ? $(`#F_5_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_5_3${location}tea`).html() ? (await view_VT(year, $(`#F_5_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_5_3${location}tea`).html() ? (await view_VT(year, $(`#F_5_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            4: {
                                classname: $(`#F_5_4${location}subj`).html() ? $(`#F_5_4${location}subj`).html() : "",
                                teacher: $(`#F_5_4${location}tea`).html() ? $(`#F_5_4${location}tea`).html() : "",
                                classID: $(`#F_5_4${location}tea`).html() ? $(`#F_5_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_5_4${location}tea`).html() ? (await view_VT(year, $(`#F_5_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_5_4${location}tea`).html() ? (await view_VT(year, $(`#F_5_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            5: {
                                classname: $(`#F_5_5${location}subj`).html() ? $(`#F_5_5${location}subj`).html() : "",
                                teacher: $(`#F_5_5${location}tea`).html() ? $(`#F_5_5${location}tea`).html() : "",
                                classID: $(`#F_5_5${location}tea`).html() ? $(`#F_5_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_5_5${location}tea`).html() ? (await view_VT(year, $(`#F_5_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_5_5${location}tea`).html() ? (await view_VT(year, $(`#F_5_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            6: {
                                classname: $(`#F_5_6${location}subj`).html() ? $(`#F_5_6${location}subj`).html() : "",
                                teacher: $(`#F_5_6${location}tea`).html() ? $(`#F_5_6${location}tea`).html() : "",
                                classID: $(`#F_5_6${location}tea`).html() ? $(`#F_5_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_5_6${location}tea`).html() ? (await view_VT(year, $(`#F_5_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_5_6${location}tea`).html() ? (await view_VT(year, $(`#F_5_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            7: {
                                classname: $(`#F_5_7${location}subj`).html() ? $(`#F_5_7${location}subj`).html() : "",
                                teacher: $(`#F_5_7${location}tea`).html() ? $(`#F_5_7${location}tea`).html() : "",
                                classID: $(`#F_5_7${location}tea`).html() ? $(`#F_5_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_5_7${location}tea`).html() ? (await view_VT(year, $(`#F_5_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_5_7${location}tea`).html() ? (await view_VT(year, $(`#F_5_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            8: {
                                classname: $(`#F_5_8${location}subj`).html() ? $(`#F_5_8${location}subj`).html() : "",
                                teacher: $(`#F_5_8${location}tea`).html() ? $(`#F_5_8${location}tea`).html() : "",
                                classID: $(`#F_5_8${location}tea`).html() ? $(`#F_5_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_5_8${location}tea`).html() ? (await view_VT(year, $(`#F_5_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_5_8${location}tea`).html() ? (await view_VT(year, $(`#F_5_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                        },
                        day6: {
                            1: {
                                classname: $(`#F_6_1${location}subj`).html() ? $(`#F_6_1${location}subj`).html() : "",
                                teacher: $(`#F_6_1${location}tea`).html() ? $(`#F_6_1${location}tea`).html() : "",
                                classID: $(`#F_6_1${location}tea`).html() ? $(`#F_6_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_6_1${location}tea`).html() ? (await view_VT(year, $(`#F_6_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_6_1${location}tea`).html() ? (await view_VT(year, $(`#F_6_1${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            2: {
                                classname: $(`#F_6_2${location}subj`).html() ? $(`#F_6_2${location}subj`).html() : "",
                                teacher: $(`#F_6_2${location}tea`).html() ? $(`#F_6_2${location}tea`).html() : "",
                                classID: $(`#F_6_2${location}tea`).html() ? $(`#F_6_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_6_2${location}tea`).html() ? (await view_VT(year, $(`#F_6_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_6_2${location}tea`).html() ? (await view_VT(year, $(`#F_6_2${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            3: {
                                classname: $(`#F_6_3${location}subj`).html() ? $(`#F_6_3${location}subj`).html() : "",
                                teacher: $(`#F_6_3${location}tea`).html() ? $(`#F_6_3${location}tea`).html() : "",
                                classID: $(`#F_6_3${location}tea`).html() ? $(`#F_6_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_6_3${location}tea`).html() ? (await view_VT(year, $(`#F_6_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_6_3${location}tea`).html() ? (await view_VT(year, $(`#F_6_3${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            4: {
                                classname: $(`#F_6_4${location}subj`).html() ? $(`#F_6_4${location}subj`).html() : "",
                                teacher: $(`#F_6_4${location}tea`).html() ? $(`#F_6_4${location}tea`).html() : "",
                                classID: $(`#F_6_4${location}tea`).html() ? $(`#F_6_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_6_4${location}tea`).html() ? (await view_VT(year, $(`#F_6_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_6_4${location}tea`).html() ? (await view_VT(year, $(`#F_6_4${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            5: {
                                classname: $(`#F_6_5${location}subj`).html() ? $(`#F_6_5${location}subj`).html() : "",
                                teacher: $(`#F_6_5${location}tea`).html() ? $(`#F_6_5${location}tea`).html() : "",
                                classID: $(`#F_6_5${location}tea`).html() ? $(`#F_6_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_6_5${location}tea`).html() ? (await view_VT(year, $(`#F_6_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_6_5${location}tea`).html() ? (await view_VT(year, $(`#F_6_5${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            6: {
                                classname: $(`#F_6_6${location}subj`).html() ? $(`#F_6_6${location}subj`).html() : "",
                                teacher: $(`#F_6_6${location}tea`).html() ? $(`#F_6_6${location}tea`).html() : "",
                                classID: $(`#F_6_6${location}tea`).html() ? $(`#F_6_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_6_6${location}tea`).html() ? (await view_VT(year, $(`#F_6_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_6_6${location}tea`).html() ? (await view_VT(year, $(`#F_6_6${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            7: {
                                classname: $(`#F_6_7${location}subj`).html() ? $(`#F_6_7${location}subj`).html() : "",
                                teacher: $(`#F_6_7${location}tea`).html() ? $(`#F_6_7${location}tea`).html() : "",
                                classID: $(`#F_6_7${location}tea`).html() ? $(`#F_6_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_6_7${location}tea`).html() ? (await view_VT(year, $(`#F_6_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_6_7${location}tea`).html() ? (await view_VT(year, $(`#F_6_7${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                            8: {
                                classname: $(`#F_6_8${location}subj`).html() ? $(`#F_6_8${location}subj`).html() : "",
                                teacher: $(`#F_6_8${location}tea`).html() ? $(`#F_6_8${location}tea`).html() : "",
                                classID: $(`#F_6_8${location}tea`).html() ? $(`#F_6_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, "") : "",
                                meet: $(`#F_6_8${location}tea`).html() ? (await view_VT(year, $(`#F_6_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).meet : "",
                                classroom: $(`#F_6_8${location}tea`).html() ? (await view_VT(year, $(`#F_6_8${location}tea`).attr('onclick').replace(/view_Week_Sec\('|','TEA'\);/gi, ""))).classroom : "",
                            },
                        },
                    };
                    console.log(data);
                }
                catch (error) {
                    return { error: "error during getting table" };
                };
            }
            else {
                return { error: "network error 3" };
            };
        }
        catch (err) {
            console.log('error:\n', err);
        };
    }
}

/**
 * Get Schedule by className, year?, week?
 * @param { string } className 
 * @param { number } year
 * @param { number } week
 */
async function getSchedule(className, year, week) {
    let response = new timetable(className, year, week);
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
// getSchedule('Y38')
//     .then(data => {
//         console.log(data);
//     }).catch(err => {
//         console.log('err:\n', err);
//     });
// getSchedule('X21', 1101, 8)
//     .then(data => {
//         console.log(data);
//     }).catch(err => {
//         console.log('err:\n', err);
//     });
/*--------------Test--------------*/
export default getSchedule;