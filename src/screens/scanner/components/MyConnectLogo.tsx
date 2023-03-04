import React from 'react';
import { Center, Text, useColorMode, useTheme, View } from 'native-base';

import { MyConnectIcon } from '@components/icons';

export const MyConnectLogo: React.FC = () => {
    const { colorMode } = useColorMode();
    const { colors } = useTheme();

    const logoColor = colorMode === 'dark' ? colors.dark[100] : colors.dark[700];

    return (
        <Center>
            <MyConnectIcon size={136} color={logoColor} />
            <View h={6} />
            <Text fontSize={'3xl'} fontWeight={'semibold'} color={logoColor}>
                myConnect
            </Text>
        </Center>
    );
};
