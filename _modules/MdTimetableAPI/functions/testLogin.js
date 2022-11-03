import axios from "axios";
import iconv from "iconv-lite";
import { load } from "cheerio";


export async function testLogin(ID, PWD, timeout) {
    var response = {};
    try {
        const loginResponse = await axios.get(
            `http://140.128.156.40/crm/login.asp?user_id=${ID}&user_password=${PWD}`,
            {
                timeout: timeout,
                "transformResponse": [data => {
                    return iconv.decode(Buffer.from(data), "big5");
                }]
            }
        );
        const loginResponse_cookie = loginResponse.headers["set-cookie"].toString().split(";")[0];
        if (loginResponse.status == 200) {
            const path = loginResponse.request.path.split("&")[0];
            let status;
            switch (path) {
                case "/CRM/mess.asp?err_code=3":
                    status = 0;
                    break;
                case "/crm/index.asp":
                    // const $ = load(loginResponse.data);
                    // // console.log($("body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2) > font > strong"));
                    // console.log(loginResponse.data);
                    status = 0;
                    break;
                case "/crm/mess.asp?err_code=1":
                    status = 1;
                    break;
                case "/crm/mess.asp?err_code=2":
                    status = 2;
                    break;
            };
            response = {
                status: status,
                cookie: status == 0 ? loginResponse_cookie : "",
                error: null,
            };
        }
        else {
            response = {
                status: 3,
                cookie: null,
                error: "MD server error",
            };
        };
    }
    catch (error) {
        console.log(error);
        response = {
            status: 3,
            cookie: null,
            error: "MD server timeout",
        };
    };
    return response;
}