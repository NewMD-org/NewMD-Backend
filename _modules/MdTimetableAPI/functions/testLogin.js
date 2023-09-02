import axios from "axios";


export async function testLogin(ID, PWD, timeout) {
    try {
        try {
            return timetableMethod(ID, PWD, 4 * 1000);
        }
        catch (error) {
            return mdappMethod(ID, PWD, timeout);
        }
    }
    catch (error) {
        return 0;
    }
}

/**
 * Login using timetable route
 * @param {string} ID User's username
 * @param {string} PWD User's password
 * @param {*} timeout Response timeout in milliseconds
 * @returns {number} 1-Success 2-Wrong Username or Password
 */
async function timetableMethod(ID, PWD, timeout) {
    const response = await axios.postForm(
        "http://libauto.mingdao.edu.tw/LibraryAuto/Web/login_a.php",
        {
            sureReg: "YES",
            userID: ID,
            userPWD: PWD
        },
        {
            timeout: timeout,
            validateStatus: (status) => {
                return status === 200;
            }
        }
    );

    return (response.data.includes("Mingdao High School")) ? 1 : 2;
}

/**
 * Login using mdapp route
 * @param {string} ID User's username
 * @param {string} PWD User's password
 * @param {*} timeout Response timeout in milliseconds
 * @returns {number} 1-Success 2-Wrong Username or Password
 */
async function mdappMethod(ID, PWD, timeout) {
    const response = await axios.postForm(
        "http://140.128.156.106/MDAPP/SloginX.php",
        {
            Uname: ID,
            Upwd: PWD,
            sure_login: "yes",
        },
        {
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
                "Cookie": "PHPSESSID=newmd"
            },
            timeout: timeout,
            validateStatus: (status) => {
                return status === 200;
            }
        }
    );

    console.log(response.data);
    return (response.data.includes("您的身分是")) ? 1 : 2;
}