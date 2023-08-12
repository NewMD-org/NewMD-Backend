/**
 * Converts milliseconds to a human-readable time duration.
 * 
 * @param {number} milliseconds - The number of milliseconds to convert.
 * @returns {{
 *  specific: {
 *      year: number,
 *      month: number,
 *      day: number,
 *      hour: number,
 *      minute: number,
 *      second: number
 *  },
 *  string: string
 * }} An object containing specific time units and a formatted string representing the duration.
 * @example
 * const milliseconds = 123456789;
 * const result = ReadableTime(milliseconds);
 * console.log(result.specific); // { year: 3, month: 9, day: 1, hour: 10, minute: 17, second: 36 }
 * console.log(result.string); // "3 years, 9 months, 1 day, 10 hours, 17 minutes, 36 seconds"
 */
export default function ReadableTime(milliseconds) {
    let year,
        month,
        day,
        hour,
        minute,
        second;

    second = Math.floor(milliseconds / 1000);
    minute = Math.floor(second / 60);
    second = second % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    month = Math.floor(day / 30);
    day = day % 30;
    year = Math.floor(month / 12);
    month = month % 12;

    return {
        specific: {
            year,
            month,
            day,
            hour,
            minute,
            second
        },
        string: [
            year && `${year} ${year === 1 ? "year" : "years"}`,
            month && `${month} ${month === 1 ? "month" : "months"}`,
            day && `${day} ${day === 1 ? "day" : "days"}`,
            hour && `${hour} ${hour === 1 ? "hour" : "hours"}`,
            minute && `${minute} ${minute === 1 ? "minute" : "minutes"}`,
            second && `${second} ${second === 1 ? "second" : "seconds"}`
        ].filter(Boolean).join(", ")
    };
}