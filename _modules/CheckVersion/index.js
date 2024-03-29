import axios from "axios";


export default async function CheckVersion() {
    try {
        const response = await axios.get("https://raw.githubusercontent.com/NewMD-org/NewMD-Backend/main/package.json");

        const responseObj = response.data;
        const version = responseObj?.version;
        if (!version) throw new Error("Empty response object");

        return version;
    }
    catch (error) {
        throw new Error(error?.message);
    }
}