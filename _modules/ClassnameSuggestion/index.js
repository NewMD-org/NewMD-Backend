import axios from "axios";


export default async function ClassnameSuggestion(original, replacement) {
    if (original === "" || replacement === "" || original.includes(" ") || replacement.includes(" ")) {
        return {
            status: 2,
            url: null
        };
    }

    const requestObject = {
        title: "Classname Replacement Suggestion",
        body: `\`${original}\` should be replace with \`${replacement}\`\n\n<details><summary>Code</summary><h4>["${original}", "${replacement}"]</h4></details>`,
        milestone: 1,
        labels: ["Classname Replacement Suggestion"]
    };

    try {
        const listResponse = await axios.get(
            "https://api.github.com/repos/NewMD-org/Configurations/issues",
            {
                headers: {
                    "Accept": "application/vnd.github+json",
                    "Authorization": `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            }
        );
        const issueList = listResponse.data;

        const repeatedIssue = issueList.find(issue => issue.title === "Classname Replacement Suggestion" && issue.body === requestObject.body);
        if (!repeatedIssue) {
            const issueResponse = await axios.post(
                "https://api.github.com/repos/NewMD-org/Configurations/issues",
                JSON.stringify(requestObject),
                {
                    headers: {
                        "Accept": "application/vnd.github+json",
                        "Authorization": `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                        "X-GitHub-Api-Version": "2022-11-28",
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            return {
                status: 1,
                url: issueResponse.data.html_url
            };
        }
        else {
            return {
                status: 1,
                url: repeatedIssue.html_url
            };
        }
    } catch (error) {
        return {
            status: 0,
            url: null
        };
    }
}