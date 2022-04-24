import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { ScannerStack } from '@navigation/stacks';
import { useColorMode, useTheme } from 'native-base';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GraphScreen, SettingsScreen } from '@src/screens';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TRootNavigator } from '../types/TRootNavigator';

export const RootNavigator: React.FC = () => {
    const Tab = createBottomTabNavigator<TRootNavigator>();
    const { colorMode } = useColorMode();
    const { colors } = useTheme();
    const isDarkMode = colorMode === 'dark';

    const activeTintColor = colors.primary[700];
    const inactiveTintColor = colors.dark[500];
    return (
        <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarActiveTintColor: activeTintColor,
                    tabBarInactiveTintColor: inactiveTintColor,
                    tabBarStyle: {
                        borderTopWidth: 0,
                    },
                    tabBarIcon: ({ focused }) => {
                        let iconName = '';
                        const iconSize = 28;
                        const iconColor = focused ? activeTintColor : inactiveTintColor;

                        if (route.name === 'Scanner') iconName = 'rss-feed';
                        if (route.name === 'Graph') iconName = 'show-chart';
                        if (route.name === 'Settings') iconName = 'settings';

                        return <Icon name={iconName} size={iconSize} color={iconColor} />;
                    },
                })}
            >
                <Tab.Screen
                    name="Scanner"
                    component={ScannerStack}
                    options={{ headerShown: false }}
                />
                <Tab.Screen
                    name="Graph"
                    component={GraphScreen}
                    options={{ headerTitle: 'RSSI Graph' }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{ headerTitle: 'Settings' }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
