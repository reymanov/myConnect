import React from 'react';
import { DarkTheme } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, HStack, Spacer, Text, useColorMode, useTheme, VStack } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemedText from '@src/components/texts/ThemedText';
import { HapticFeedback } from '@src/utils/HapticFeedback';
import { SignalStrength } from './SignalStrength';

interface Props {
    id: string;
    name: string | null;
    rssi: number | null;
    isScanActive: boolean;
    isConnected: boolean | null;
    onPress: () => void;
    onButtonPress: (id: string) => void;
}

export const DiscoveredDevice: React.FC<Props> = ({
    id,
    name,
    rssi,
    isScanActive,
    isConnected,
    onPress,
    onButtonPress,
}) => {
    const { colorMode } = useColorMode();
    const { colors } = useTheme();

    const isDarkMode = colorMode === 'dark';
    const backgroundColor = isDarkMode ? DarkTheme.colors.card : colors.white;
    const iconColor = colors.dark[400];

    const handleButtonPress = () => {
        HapticFeedback('impactLight');
        onButtonPress(id);
    };

    return (
        <TouchableOpacity style={[styles.item, { backgroundColor }]} onPress={onPress}>
            <HStack w={'full'} alignItems={'center'} space={4}>
                <VStack alignItems={'center'} space={1}>
                    <Icon name={'bluetooth'} size={28} color={iconColor} />
                    <SignalStrength rssi={isScanActive || isConnected ? rssi : null} />
                </VStack>

                <VStack space={'md'}>
                    <ThemedText fontSize={'md'} fontWeight={'medium'}>
                        {name || 'N/A'}
                    </ThemedText>
                    <HStack alignItems={'center'} space={1}>
                        <Icon name={'signal-cellular-alt'} size={14} color={iconColor} />
                        <ThemedText fontSize={'xs'} fontWeight={'light'}>
                            {isScanActive || (isConnected && rssi) ? `${rssi} dBm` : 'N/A'}
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
                        {isConnected ? 'Disconnect' : 'Connect'}
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
