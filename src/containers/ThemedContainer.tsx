import React from 'react';
import { View, ViewProps } from 'react-native';
import { useColorMode, useTheme } from 'native-base';

const ThemedContainer: React.FC<ViewProps> = ({ style, ...props }) => {
    const { colorMode } = useColorMode();
    const { colors } = useTheme();
    const isDarkMode = colorMode === 'dark';
    const backgroundColor = isDarkMode ? colors.dark[50] : colors.dark[800];

    return (
        <View style={[{ backgroundColor }, style]} {...props}>
            {props.children}
        </View>
    );
};

export default ThemedContainer;
