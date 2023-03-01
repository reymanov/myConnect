import React, { useEffect } from 'react';
import { ColorMode, extendTheme, NativeBaseProvider, StorageManager } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@navigation/main';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { store } from '@src/store';
import { AsyncStorage } from 'react-native';

const config = {
    useSystemColorMode: false,
};

const colorModeManager: StorageManager = {
    get: async () => {
        try {
            let val = await AsyncStorage.getItem('@color-mode');
            return val === 'dark' ? 'dark' : 'light';
        } catch (e) {
            return 'light';
        }
    },
    set: async (value: ColorMode) => {
        try {
            await AsyncStorage.setItem('@color-mode', value as string);
        } catch (e) {
            console.log(e);
        }
    },
};

const customTheme = extendTheme({ config });

const App: React.FC = () => {
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <NativeBaseProvider theme={customTheme} colorModeManager={colorModeManager}>
                    <RootNavigator />
                </NativeBaseProvider>
            </Provider>
        </SafeAreaProvider>
    );
};

console.disableYellowBox = true;
export default App;
