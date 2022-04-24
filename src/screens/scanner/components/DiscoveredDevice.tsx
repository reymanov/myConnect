import React from 'react';
import { DarkTheme } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Box, Button, HStack, Spacer, Text, useColorMode, useTheme, VStack } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemedText from '@src/components/texts/ThemedText';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

interface Props {
    name?: string;
    rssi?: string;
    onPress: () => void;
    onButtonPress: () => void;
}

export const DiscoveredDevice: React.FC<Props> = ({ name, rssi, onPress, onButtonPress }) => {
    const { colorMode } = useColorMode();
    const { colors } = useTheme();

    const isDarkMode = colorMode === 'dark';
    const backgroundColor = isDarkMode ? DarkTheme.colors.card : colors.white;
    const iconColor = colors.dark[400];

    const handleButtonPress = () => {
        ReactNativeHapticFeedback.trigger('impactLight', options);
        onButtonPress();
    };

    return (
        <TouchableOpacity style={[styles.item, { backgroundColor }]} onPress={onPress}>
            <HStack w={'full'} alignItems={'center'} space={4}>
                <Box backgroundColor={backgroundColor}>
                    <Icon name={'bluetooth'} size={28} color={iconColor} />
                </Box>

                <VStack space={'md'}>
                    <ThemedText fontSize={'md'} fontWeight={'medium'}>
                        {name || 'N/A'}
                    </ThemedText>
                    <HStack alignItems={'center'} space={1}>
                        <Icon name={'signal-cellular-alt'} size={14} color={iconColor} />
                        <ThemedText fontSize={'xs'} fontWeight={'light'}>
                            {rssi ? `${rssi} dBm` : 'N/A'}
                        </ThemedText>
                    </HStack>
                </VStack>

                <Spacer />

                <Button
                    rounded={'md'}
                    size={'xs'}
                    onPress={handleButtonPress}
                    bg={colors.primary[700]}
                    _pressed={{ bg: colors.primary[600] }}
                >
                    <Text color={colors.white} fontWeight={'medium'}>
                        Connect
                    </Text>
                </Button>
            </HStack>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        minHeight: 80,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
