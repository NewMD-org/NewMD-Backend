import axios from "axios";
import iconv from "iconv-lite";


export async function testLogin(ID, PWD, timeout) {
    var response = {};
    try {
        const loginResponse = await axios.get(
            `http://140.128.156.40/crm/login.asp?user_id=${ID}&user_password=${PWD}`,
            {
                timeout: timeout,
                "transformResponse": [data => {
                    // eslint-disable-next-line no-undef
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
                case "/crm/index.asp?l=p":
                    status = 0;
                    break;
                case "/crm/mess.asp?err_code=1":
                    status = 1;
                    break;
                case "/crm/mess.asp?err_code=2":
                    status = 2;
                    break;
            }
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
                error: "testLogin : MD server error",
            };
        }
    }
    catch (error) {
        response = {
            status: 3,
            cookie: null,
            error: "testLogin : MD server timeout",
        };
    }
    return response;
}