function cls(className) {
    let split = className.split('');

    let a = split[0]; //Y
    let b = split[1]; //1, 2, 3
    let c = parseInt(className.substring(2, 4)).toString();
    let d = ('000' + (parseInt(split[1]) + 6)).slice(-2);
    let e = ('000' + parseInt(className.substring(2, 4))).slice(-3);

    let x = a + d + e;
    let y = a + b + c;
    let input = className;
    let output = x + "@" + y;

    return {
        input,
        output
    }
}

module.exports.cls = cls