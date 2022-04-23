import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/navigators';
import SplashScreen from 'react-native-splash-screen';

const App: React.FC = () => {
    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hide();
        }, 2000);
    }, []);
    return (
        <SafeAreaProvider>
            <StatusBar />
            <RootNavigator />
        </SafeAreaProvider>
    );
};

export default App;
