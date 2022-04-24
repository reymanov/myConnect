import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DeviceScreen, ScannerScreen } from '@src/screens';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useColorMode, useTheme } from 'native-base';
import { Pressable } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

export const MainStack: React.FC = () => {
    const Stack = createNativeStackNavigator();
    const { colorMode } = useColorMode();
    const { colors } = useTheme();
    const isDarkMode = colorMode === 'dark';
    const iconColor = isDarkMode ? colors.dark[900] : colors.black;

    const [isEnabled, setIsEnabled] = useState(false);

    const handleScannPress = () => {
        isEnabled
            ? ReactNativeHapticFeedback.trigger('impactHeavy', options)
            : ReactNativeHapticFeedback.trigger('notificationSuccess', options);

        setIsEnabled(!isEnabled);
    };

    return (
        <Stack.Navigator
            screenOptions={{
                headerShadowVisible: false,
                headerTitleStyle: { fontSize: 18 },
                headerBackTitle: 'Back',
            }}
        >
            <Stack.Screen
                name="Scanner"
                component={ScannerScreen}
                options={{
                    headerRight: () => (
                        <Pressable onPress={handleScannPress}>
                            <Icon
                                name={isEnabled ? 'stop' : 'play'}
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
