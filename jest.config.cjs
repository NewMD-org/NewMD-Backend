/** @type {import('jest').Config} */
const config = {
    verbose: true,
    setupFiles: ["dotenv/config", "./jest-setup.js"],
    transformIgnorePatterns: ["node_modules/(?!(sucrase)/)"],
    transform: {},
};

module.exports = config;