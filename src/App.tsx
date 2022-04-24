import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { extendTheme, NativeBaseProvider } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/navigators';
import SplashScreen from 'react-native-splash-screen';

const config = {
    useSystemColorMode: true,
};

const customTheme = extendTheme({ config });

const App: React.FC = () => {
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <SafeAreaProvider>
            <NativeBaseProvider theme={customTheme}>
                <StatusBar />
                <RootNavigator />
            </NativeBaseProvider>
        </SafeAreaProvider>
    );
};

console.disableYellowBox = true;
export default App;
