import axios from 'axios';


async function login(ID, PWD) {
    const loginResponse = await axios.get(`https://crm.mingdao.edu.tw/crm/login.asp?user_id=${ID}&user_password=${PWD}`);
    const loginResponse_cookie = loginResponse.headers['set-cookie'].toString().split(';')[0];
    if (loginResponse.status == 200) {
        const url = loginResponse.request.res.responseUrl;
        let status;
        switch (url.substring(0, 50)) {
            case "https://crm.mingdao.edu.tw/crm/index.asp":
                status = 0;
                break;
            case "https://crm.mingdao.edu.tw/crm/mess.asp?err_code=1":
                status = 1;
                break;
            case "https://crm.mingdao.edu.tw/crm/mess.asp?err_code=2":
                status = 2;
                break;
        };
        return {
            status: status,
            cookie: status == 0 ? loginResponse_cookie : "",
            error: null,
        };
    }
    else {
        return {
            status: null,
            cookie: null,
            error: "network error 1",
        };
    };
}

export default login;

/***** Test Code *******/
// login("", "").then(data => {
//     if (data.error) {
//         console.log(data);
//         console.error(data.error);
//     }
//     else {
//         console.log(data);
//     };
// });