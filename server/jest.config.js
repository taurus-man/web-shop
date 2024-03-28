/** @type {import('jest').Config} */
const config = {
    verbose: true,
    collectCoverageFrom: [
        '**/routes/*.{js,jsx}',
        '**/controllers/*.{js,jsx}',
        '**/models/*.{js,jsx}',
        '**/middleware/*.{js,jsx}',
        '!**/node_modules/**',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: -10,
        },
    },
};

module.exports = config;


