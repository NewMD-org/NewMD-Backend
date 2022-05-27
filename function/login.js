import fetch from 'node-fetch';

async function login(id, pwd) {
    let firstResponse = await fetch("http://crm.mingdao.edu.tw/crm/index.asp", {
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
        return {
            status: null,
            cookie: null,
            error: "network error 1",
        };
    };
    
    let loginResponse = await fetch(`http://crm.mingdao.edu.tw/crm/login.asp?user_id=${id}&user_password=${pwd}`, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "zh-TW,zh;q=0.9",
            "upgrade-insecure-requests": "1",
            "cookie": firstResponse_cookie
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
    });
    let loginResponse_cookie;
    if (loginResponse.status == 200) {
        loginResponse_cookie = firstResponse_cookie;
        let url = Object.getOwnPropertySymbols(loginResponse).map(item => loginResponse[item])[1].url;
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
            cookie: status == 0 ? loginResponse_cookie : "",
            error: status == 0 ? null : status == 1 ? "Login error : Wrong account" : status == 2 ? "Login error : Wrong password" : null
        };
    }
    else {
        return {
            status: null,
            cookie: null,
            error: "network error 2",
        };
    };
}

export default login;

/***** Test Code *******/
// login("", "").then(data => {
//     if (!data.error) {
//         console.log(data);
//     }
//     else {
//         console.log(data);
//         console.error(data.error);
//     };
// });