import axios from "axios";
import iconv from "iconv-lite";


export async function getTable(ID, PWD, timeout) {
    try {
        const getCookie = await axios.get(
            "http://140.128.156.92/AACourses/Web/wLogin.php",
            {
                validateStatus: (status) => {
                    return status === 200;
                }
            }
        );
        const cookie = getCookie.headers["set-cookie"][0].split(";")[0];

        const getTableResponse = await axios.postForm(
            "http://140.128.156.92/AACourses/Web/wLogin.php",
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
    } catch (error) {
        throw new Error("fastTable : MD server error");
    }
}