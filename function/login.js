const fetch = require('node-fetch');

async function login(id, pwd) {
    let data = new Object();

    data = await fetch("http://crm.mingdao.edu.tw/crm/index.asp", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "zh-TW,zh;q=0.9",
            "upgrade-insecure-requests": "1"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
    }).then(response => {
        //console.log(response);
        let setCookie = Object.getOwnPropertySymbols(response).map(item => response[item])[1].headers.get('set-cookie').split(';')[0];
        return setCookie;
    }).then(async cookie => {
        let data = await fetch(`http://crm.mingdao.edu.tw/crm/login.asp?user_id=${id}&user_password=${pwd}`, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "zh-TW,zh;q=0.9",
                "upgrade-insecure-requests": "1",
                "cookie": cookie
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET"
        }).then(response => {
            //console.log(response);
            let url = Object.getOwnPropertySymbols(response).map(item => response[item])[1].url;
            let status;
            switch (url.substring(0, 49)) {
                case "http://crm.mingdao.edu.tw/crm/index.asp":
                    status = 0;
                    break;
                case "http://crm.mingdao.edu.tw/crm/mess.asp?err_code=1":
                    status = 1;
                    break;
                case "http://crm.mingdao.edu.tw/crm/mess.asp?err_code=2":
                    status = 2;
                    break;
            }
            return {
                status: status,
                cookie: cookie
            };
        }).catch(_ => {
            return {
                error: "network error 2"
            };
        });
        return data;
    }).catch(_ => {
        return {
            error: "network error 1"
        };
    });
    return data;
}

module.exports.login = login;

/***** Test Code *******/
/*** 
login("Q124751571", "wes20060929").then(data => {
    if (!data.error) {
        console.log(data);
    }
    else {
        console.error(data.error);
    };
});
***/