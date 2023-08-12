/* eslint-disable no-undef */
import ReadableTime from "../../../_modules/ReadableTime/index.js";


describe("ReadableTime function", () => {
    test("should return the correct time for 1 year, 2 months, 3 days, 4 hours, 5 minutes, and 6 seconds", () => {
        const milliseconds = ((1 * 12 + 2) * 30 + 3) * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000 + 5 * 60 * 1000 + 6 * 1000;
        const result = ReadableTime(milliseconds);
        expect(result.specific).toEqual({ year: 1, month: 2, day: 3, hour: 4, minute: 5, second: 6 });
        expect(result.string).toBe("1 year, 2 months, 3 days, 4 hours, 5 minutes, 6 seconds");
    });

    test("should return the correct time for 1 year, 1 month, 1 day, 1 hour, 1 minute, and 1 second", () => {
        const milliseconds = ((1 * 12 + 1) * 30 + 1) * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000 + 1 * 60 * 1000 + 1 * 1000;
        const result = ReadableTime(milliseconds);
        expect(result.specific).toEqual({ year: 1, month: 1, day: 1, hour: 1, minute: 1, second: 1 });
        expect(result.string).toBe("1 year, 1 month, 1 day, 1 hour, 1 minute, 1 second");
    });

    test("should return the correct time for 0 year, 0 month, 0 day, 0 hour, 0 minute, and 0 second", () => {
        const milliseconds = 0;
        const result = ReadableTime(milliseconds);
        expect(result.specific).toEqual({ year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0 });
        expect(result.string).toBe("");
    });
});