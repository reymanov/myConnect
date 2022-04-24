import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainScreen } from '@src/screens';

export const MainStack: React.FC = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
            <Stack.Screen name="Scanner" component={MainScreen} />
        </Stack.Navigator>
    );
};
