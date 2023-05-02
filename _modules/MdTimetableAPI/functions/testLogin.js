import axios from "axios";


export async function testLogin(ID, PWD, timeout) {
    try {
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
    catch (error) {
        return 0;
    }
}