module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        '@react-native-community',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react:hooks'],
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'react-native/no-inline-styles': 'off',
                '@typescript-eslint/no-shadow': ['error'],
                '@typescript-eslint/no-empty-function': 'off',
                '@typescript-eslint/no-var-requires': 'off',
                'no-shadow': 'off',
                'no-undef': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
            },
        },
    ],
};
