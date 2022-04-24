import React from 'react';
import { ViewProps } from 'react-native';
import { useColorMode, useTheme } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

const ThemedContainer: React.FC<ViewProps> = props => {
    const { colorMode } = useColorMode();
    const { colors } = useTheme();
    const isDarkMode = colorMode === 'dark';
    const backgroundColor = isDarkMode ? colors.dark[50] : colors.dark[800];

    return (
        <SafeAreaView style={[props.style, { backgroundColor }]} {...props}>
            {props.children}
        </SafeAreaView>
    );
};

export default ThemedContainer;
