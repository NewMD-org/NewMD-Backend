import axios from "axios";
import iconv from "iconv-lite";


export async function getTable(ID, PWD, timeout) {
    const urls = [
        "https://s44.mingdao.edu.tw/AACourses/Web/wLogin.php",
        "http://140.128.156.92/AACourses/Web/wLogin.php"
    ];

    try {
        const account = { ID, PWD };
        for (const url of urls) {
            try {
                return await ClassArrangementSystemLogin(account, timeout, url);
            }
            catch (error) {
                console.log(`Failed to get table using URL: ${url}`);
            }
        }
        throw new Error("fastTable: All URLs failed");
    }
    catch (error) {
        throw new Error("fastTable: MD server error");
    }
}

async function ClassArrangementSystemLogin(accountData, timeout, URL) {
    const { ID, PWD } = accountData;

    const getCookie = await axios.get(
        URL,
        {
            validateStatus: (status) => {
                return status === 200;
            }
        }
    );
    const cookie = getCookie.headers["set-cookie"][0].split(";")[0];

    const getTableResponse = await axios.postForm(
        URL,
        {
            sureReg: "YES",
            accessWay: "ACCOUNT",
            wRole: "STD",
            stdID: ID,
            stdPWD: PWD
        },
        {
            headers: {
                cookie: cookie
            },
            validateStatus: (status) => {
                return status === 200;
            },
            timeout: timeout,
            responseType: "arraybuffer",
            transformResponse: [data => {
                // eslint-disable-next-line no-undef
                return iconv.decode(Buffer.from(data), "big5");
            }]
        }
    );

    return {
        tableHTML: getTableResponse.data,
        cookie: cookie
    };
}