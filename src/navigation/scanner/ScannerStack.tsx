import React from 'react';
import { Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { useColorMode, useTheme } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { triggerHapticFeedback } from '@utils/HapticFeedback';
import { DeviceScreen, ScannerScreen } from '@screens/index';
import { bleActions, useSelectIsScanning } from '@store/ble';
import { TScannerNavigationProp } from '@navigation/types/TScannerNavigationProp';

export const ScannerStack: React.FC = () => {
    const Stack = createNativeStackNavigator<TScannerNavigationProp>();
    const isScanning = useSelectIsScanning();
    const { colorMode } = useColorMode();
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const isDarkMode = colorMode === 'dark';
    const iconColor = isDarkMode ? colors.dark[900] : colors.black;

    const startScan = () => {
        triggerHapticFeedback('notificationSuccess');
        dispatch(bleActions.startScan());
    };

    const stopScan = () => {
        triggerHapticFeedback('impactHeavy');
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
            <Stack.Screen
                name="Device"
                component={DeviceScreen}
                options={({ route }) => ({ title: route.params.device.name || 'Device' })}
            />
        </Stack.Navigator>
    );
};
