module.exports = api => {
    api.cache(false);
    const plugins = [
        [
            'module-resolver',
            {
                root: ['./'],
                alias: {
                    '@src': './src',
                    '@assets': './src/assets',
                    '@components': './src/components',
                    '@constants': './src/constants',
                    '@navigation': './src/navigation',
                    '@screens': './src/screens',
                    '@store': './src/store',
                    '@utils': './src/utils',
                },
            },
        ],
    ];

    return {
        presets: ['module:metro-react-native-babel-preset'],
        plugins: [...plugins],
    };
};
