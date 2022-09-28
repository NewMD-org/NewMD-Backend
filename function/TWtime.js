export function TWtime() {
    let dateObject_TW = new Date();
    let timeString_TW = dateObject_TW.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    let millisecondString_TW = dateObject_TW.getMilliseconds().toLocaleString('zh-TW');
    return {
        full: timeString_TW + ':' + (millisecondString_TW.length == 3 ? millisecondString_TW : '0' + millisecondString_TW) + ' (GMT+8)',
        time: timeString_TW,
        gmt: '(GMT+8)',
        timeZone: 'Asia/Taipei'
    };
}