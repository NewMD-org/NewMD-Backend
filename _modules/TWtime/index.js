export function TWtime() {
    let dateObject_TW = new Date();
    let timeString_TW = dateObject_TW.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    let millisecondString_TW = dateObject_TW.getMilliseconds().toLocaleString('zh-TW');
    return {
        full: timeString_TW + ':' + ("000" + millisecondString_TW).slice(-3) + ' (GMT+8)',
        time: timeString_TW,
        gmt: '(GMT+8)',
        timeZone: 'Asia/Taipei'
    };
}