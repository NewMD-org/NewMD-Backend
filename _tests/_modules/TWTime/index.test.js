/* eslint-disable no-undef */
import { TWtime } from "../../../_modules/TWtime";


describe("TWtime function", () => {
    // Mock the Date object
    const RealDate = Date;
    const dateNowStub = jest.fn();

    beforeAll(() => {
        global.Date = class extends RealDate {
            constructor(date) {
                if (date) {
                    return new RealDate(date);
                }
                return new RealDate(dateNowStub());
            }
            static now() {
                return dateNowStub();
            }
        };
    });

    afterAll(() => {
        global.Date = RealDate; // restore the original Date object after all tests
    });

    test("should return the correct full time string for 7:27:53 PM", () => {
        dateNowStub.mockReturnValue(new Date("2023-08-12T11:27:53.000Z").getTime());
        const result = TWtime();
        expect(result.full).toBe("2023/8/12 下午7:27:53:000 (GMT+8)");
    });

    test("should return the correct full time string for 12:00:00 AM", () => {
        dateNowStub.mockReturnValue(new Date("2023-08-12T16:00:00.000Z").getTime());
        const result = TWtime();
        expect(result.full).toBe("2023/8/13 上午12:00:00:000 (GMT+8)");
    });

    test("should return the correct full time string for 6:00:00 AM", () => {
        dateNowStub.mockReturnValue(new Date("2023-08-12T22:00:00.000Z").getTime());
        const result = TWtime();
        expect(result.full).toBe("2023/8/13 上午6:00:00:000 (GMT+8)");
    });
});