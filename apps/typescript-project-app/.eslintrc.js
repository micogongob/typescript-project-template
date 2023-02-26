module.exports = {
    ...require('@local/config-eslint/eslint-base'),
    "parserOptions": {
        "project": ["tsconfig.json"]
    }
}