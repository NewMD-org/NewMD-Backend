/* eslint-disable no-undef */
import axios from "axios";
import CheckVersion from "../../../_modules/CheckVersion";


jest.mock("axios");
axios.get = jest.fn();

describe("CheckVersion function", () => {
    test("returns a valid version string when the API call is successful", async () => {
        axios.get.mockResolvedValue({
            data: { version: "1.2.3" },
        });

        const version = await CheckVersion();

        expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    test("throws an error when the API call fails", async () => {
        axios.get.mockRejectedValue(new Error("Network error"));

        await expect(CheckVersion()).rejects.toThrow("Network error");
    });

    test("throws an error when version is missing in the response", async () => {
        axios.get.mockResolvedValue({
            data: {},
        });

        await expect(CheckVersion()).rejects.toThrow();
    });
});