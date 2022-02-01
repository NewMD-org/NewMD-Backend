const axios = require('axios');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');

async function getIndex(cookie) {
    let data = new Object();

    data = await axios.request("http://crm.mingdao.edu.tw/crm/index.asp", {
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "zh-TW,zh;q=0.9",
            "upgrade-insecure-requests": "1",
            "cookie": cookie
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        responseType: 'arraybuffer',
        transformResponse: [function (data) {
            return iconv.decode(Buffer.from(data), 'big5')
        }]
    }).then(response => {
        if (response.status == 200) {
            let data;
            let $ = cheerio.load(response.data);
            let crm = "http://crm.mingdao.edu.tw/crm/"

            let a = $("body > table:nth-child(1) > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > font > strong");
            let b = $("body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2) > font > strong");
            let c = $("body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(1) > img");
            let d = $("body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(1) > a");
            let e = $("body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2)");
            let f = $("body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2) > div > a");
            let g = $("body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(1) > a");
            let h = $("body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(2)");
            let i = $("body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(4) > td:nth-child(1) > a");
            let j = $("body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(5) > td:nth-child(1) > a");
            let k = $("body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(6) > td:nth-child(1)");
            let l = $("body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(6) > td:nth-child(2) > a");
            let m = $("body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(7) > td > a");
            let n = $("body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(8) > td > a");
            let o = $("body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(9) > td > a");

            data = {
                1: {
                    text: a.text().split(" ")[0]
                },
                2: {
                    text: b.text().substring((b.text().indexOf("(") + 1), b.text().indexOf(")"))
                },
                3: {
                    imgurl: c.attr('src')
                },
                4: {
                    text: d.text(),
                    url: crm + d.attr("href")
                },
                5: {
                    text: e.text().split("\n")[0]
                },
                6: {
                    text: e.text().split("\n")[1].replace(/ /g, ""),
                    url: f.attr("href")
                },
                7: {
                    text: g.text(),
                    url: crm + g.attr("href")
                },
                8:{
                    text: h.text()
                },
                9: {
                    text: i.text(),
                    url: crm + i.attr("href")
                },
                10: {
                    text: j.text(),
                    url: crm + j.attr("href")
                },
                11: {
                    text: k.text()
                },
                12: {
                    text: l.text(),
                    url: crm + l.attr("href")
                },
                13: {
                    text: m.text(),
                    url: crm + m.attr("href")
                },
                14: {
                    text: n.text(),
                    url: crm + n.attr("href")
                },
                15: {
                    text: o.text(),
                    url: crm + o.attr("href")
                }
            };
            return data;
        }
        else {
            return {
                error: "network error 1"
            };
        };
    }).catch(_ => {
        return {
            error: "network error 1"
        };
    });
    return data;
}

module.exports.getIndex = getIndex;