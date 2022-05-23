import React from 'react';
import { DarkTheme } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, HStack, Spacer, Text, useColorMode, useTheme, View, VStack } from 'native-base';
import { HapticFeedback } from '@utils/HapticFeedback';
import { SignalStrength } from '@components/scanner/SignalStrength';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemedText from '@components/general/texts/ThemedText';
import { BleDevice } from '@store/devices';
import { useSelectIsDeviceConnected } from '@store/ble';

interface Props {
    device: BleDevice;
    isScanActive: boolean;
    onPress: () => void;
    onButtonPress: (id: string) => void;
}

export const DiscoveredDevice: React.FC<Props> = ({
    device,
    isScanActive,
    onPress,
    onButtonPress,
}) => {
    const { colorMode } = useColorMode();
    const { colors } = useTheme();

    const isDarkMode = colorMode === 'dark';
    const backgroundColor = isDarkMode ? DarkTheme.colors.card : colors.white;
    const iconColor = colors.dark[400];

    const { id, name, rssi, updatedAt, manufacturer } = device;
    const isConnected = useSelectIsDeviceConnected(id);
    const isReachable = Date.now() - updatedAt < 5000;

    const handleButtonPress = () => {
        HapticFeedback('impactLight');
        onButtonPress(id);
    };

    return (
        <TouchableOpacity style={[styles.item, { backgroundColor }]} onPress={onPress}>
            <HStack w={'full'} alignItems={'center'} space={4}>
                <VStack alignItems={'center'} space={1}>
                    <Icon name={'bluetooth'} size={28} color={iconColor} />
                    <SignalStrength rssi={isScanActive && isReachable ? rssi : null} />
                </VStack>

                <VStack space={'md'}>
                    <View>
                        <ThemedText fontSize={'md'} fontWeight={'medium'}>
                            {name || 'N/A'}
                        </ThemedText>
                        {manufacturer.name && (
                            <ThemedText fontSize={'xs'} fontWeight={'light'}>
                                {manufacturer.name}
                            </ThemedText>
                        )}
                    </View>

                    <HStack alignItems={'center'} space={1}>
                        <Icon name={'signal-cellular-alt'} size={14} color={iconColor} />
                        <ThemedText fontSize={'xs'} fontWeight={'light'}>
                            {isReachable && isScanActive && rssi ? `${rssi} dBm` : 'N/A'}
                        </ThemedText>
                    </HStack>
                </VStack>

                <Spacer />

                <Button rounded={'md'} size={'xs'} onPress={handleButtonPress}>
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
