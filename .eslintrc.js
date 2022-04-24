module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        '@react-native-community',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'react-native/no-inline-styles': 'off',
                '@typescript-eslint/no-shadow': ['error'],
                '@typescript-eslint/no-empty-function': 'off',
                'no-shadow': 'off',
                'no-undef': 'off',
            },
        },
    ],
};
