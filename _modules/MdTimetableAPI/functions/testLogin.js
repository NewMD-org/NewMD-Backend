import fetch from "node-fetch";


export async function testLogin(ID, PWD, timeout) {
    try {
        const firstResponse = await fetch(
            "http://140.128.156.92/AACourses/Web/wLogin.php",
            {
                timeout: timeout,
                "method": "GET"
            }
        );
        let firstResponse_setCookie = Object.getOwnPropertySymbols(firstResponse).map(item => firstResponse[item])[1].headers.get("set-cookie");
        let firstResponse_cookie;
        if (firstResponse.status == 200) {
            firstResponse_cookie = firstResponse_setCookie.split(";")[0];
        }
        else {
            console.log("er");
            return 0;
        }

        const loginResponse = await fetch(
            "http://140.128.156.92/AACourses/Web/wLogin.php",
            {
                timeout: timeout,
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "cookie": firstResponse_cookie
                },
                body: `sureReg=YES&goURL=qWTT.php&accessWay=ACCOUNT&wRole=STD&stdID=${ID}&stdPWD=${PWD}`,
                method: "POST"
            }
        );
        if (loginResponse.url === "http://140.128.156.92/AACourses/Web/qWTT.php") {
            return 1;
        }
        else {
            return 2;
        }
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}