import React from 'react';
import { ITextProps, Text, useColorMode, useTheme } from 'native-base';

const ThemedText: React.FC<ITextProps> = props => {
    const { colorMode } = useColorMode();
    const { colors } = useTheme();
    const textColor = colorMode === 'dark' ? colors.dark[900] : 'black';

    return (
        <Text color={textColor} {...props}>
            {props.children}
        </Text>
    );
};

export default ThemedText;
