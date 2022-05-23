import React from 'react';
import { ITextProps, Text, useColorMode, useTheme } from 'native-base';

interface Props {
    inverted?: boolean;
}

const ThemedText: React.FC<ITextProps & Props> = ({ inverted, ...props }) => {
    const { colorMode } = useColorMode();
    const { colors } = useTheme();
    const isDarkMode = inverted ? colorMode === 'light' : colorMode === 'dark';
    const textColor = isDarkMode ? colors.dark[900] : colors.black;

    return (
        <Text color={textColor} {...props}>
            {props.children}
        </Text>
    );
};

export default ThemedText;
