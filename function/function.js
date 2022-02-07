export const cls = (className) => {
    let split = className.split('');
    let input = className;
    if(split.length <3) {
        return {
            input,
            err : "error"
        }
    }
    let a = split[0]; //Y
    let b = split[1]; //1, 2, 3
    let c, d, e;
    if (a == 'X') {
        c = parseInt(className.substring(2, 4)).toString();
        d = ('000' + (parseInt(split[1]) + 9)).slice(-2);
        e = ('000' + parseInt(className.substring(2, 4))).slice(-3);
    } else if (a == 'Y') {
        c = parseInt(className.substring(2, 4)).toString();
        d = ('000' + (parseInt(split[1]) + 6)).slice(-2);
        e = ('000' + parseInt(className.substring(2, 4))).slice(-3);
    } else if (a == 'K') {
        c = className.substring(2, 4);
        d = ('000' + (parseInt(split[1]) + 9)).slice(-2);
        e = `${ split[2] }0${ split[3] }`;
    }else {
        return {
            input,
            err : "error"
        }
    }

    let x = a + d + e;
    let y = a + b + c;
    let output = x + "@" + y;

    return {
        input,
        output
    }
}
