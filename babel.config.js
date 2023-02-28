module.exports = api => {
    api.cache(false);
    const plugins = [
        [
            'module-resolver',
            {
                root: ['./'],
                alias: {
                    '@assets': './src/assets',
                    '@components': './src/components',
                    '@containers': './src/containers',
                    '@constants': './src/constants',
                    '@navigation': './src/navigation',
                    '@screens': './src/screens',
                    '@store': './src/store',
                    '@utils': './src/utils',
                    '@hooks': './src/hooks',
                    '@src': './src',
                },
            },
        ],
    ];

    return {
        presets: ['module:metro-react-native-babel-preset'],
        plugins: [...plugins, 'react-native-reanimated/plugin'],
    };
};
