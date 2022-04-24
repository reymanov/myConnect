import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { MainStack } from '@navigation/stacks';
import { useColorMode } from 'native-base';

export const RootNavigator: React.FC = () => {
    const { colorMode } = useColorMode();
    const isDarkMode = colorMode === 'dark';

    return (
        <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
            <MainStack />
        </NavigationContainer>
    );
};

export default RootNavigator;
