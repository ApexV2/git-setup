/** @type {import("prettier").Config} */
export default {
    endOfLine: 'auto',
    singleQuote: true,
    printWidth: 90,
    tabWidth: 4,
    overrides: [
        {
            files: ['tsconfig.json'],
            options: {
                trailingComma: 'none',
            },
        },
    ],
};
