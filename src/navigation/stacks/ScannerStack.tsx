import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DeviceScreen, ScannerScreen } from '@src/screens';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useColorMode, useTheme } from 'native-base';
import { Pressable } from 'react-native';
import { bleActions, useSelectIsScanning } from '@src/store/ble';
import { useDispatch } from 'react-redux';
import { HapticFeedback } from '@src/utils/HapticFeedback';

export const ScannerStack: React.FC = () => {
    const Stack = createNativeStackNavigator();
    const isScanning = useSelectIsScanning();
    const { colorMode } = useColorMode();
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const isDarkMode = colorMode === 'dark';
    const iconColor = isDarkMode ? colors.dark[900] : colors.black;

    const startScan = () => {
        HapticFeedback('notificationSuccess');
        dispatch(bleActions.startScan());
    };

    const stopScan = () => {
        HapticFeedback('impactHeavy');
        dispatch(bleActions.stopScan());
    };

    return (
        <Stack.Navigator
            screenOptions={{
                headerShadowVisible: false,
                headerTitleStyle: { fontSize: 18, color: isDarkMode ? colors.white : colors.black },
                headerBackTitle: 'Back',
                headerTintColor: colors.primary[600],
            }}
        >
            <Stack.Screen
                name="Scanner"
                component={ScannerScreen}
                options={{
                    headerRight: () => (
                        <Pressable onPress={isScanning ? stopScan : startScan}>
                            <Icon
                                name={isScanning ? 'stop' : 'play'}
                                size={18}
                                color={iconColor}
                                style={{ padding: 8 }}
                            />
                        </Pressable>
                    ),
                }}
            />
            <Stack.Screen name="Device" component={DeviceScreen} />
        </Stack.Navigator>
    );
};
