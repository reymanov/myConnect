import React from 'react';
import { Device } from 'react-native-ble-plx';
import { DarkTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, HStack, Spacer, Text, useColorMode, useTheme, View, VStack } from 'native-base';

import { HapticFeedback } from '@utils/HapticFeedback';
import { decodeManufacturerData } from '@utils/BleUtils';
import ThemedText from '@components/general/texts/ThemedText';
import { SignalStrength } from '@components/scanner/SignalStrength';

interface Props {
    device: Device;
    isScanActive: boolean;
    isConnected: boolean;
    onPress: () => void;
    onButtonPress: (id: string) => void;
}

export const DeviceListItem: React.FC<Props> = ({
    device,
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

    const { id, name, rssi, manufacturerData } = device;

    const manufacturer = decodeManufacturerData(manufacturerData);

    const handleButtonPress = () => {
        HapticFeedback('impactLight');
        onButtonPress(id);
    };

    return (
        <TouchableOpacity style={[styles.item, { backgroundColor }]} onPress={onPress}>
            <HStack w={'full'} alignItems={'center'} space={4}>
                <VStack alignItems={'center'} space={1}>
                    <Icon name={'bluetooth'} size={28} color={iconColor} />
                    <SignalStrength rssi={isScanActive ? rssi : null} />
                </VStack>

                <VStack flexShrink={1}>
                    <View>
                        <ThemedText fontSize={'md'} fontWeight={'medium'}>
                            {name || 'N/A'}
                        </ThemedText>
                        {manufacturer?.name && (
                            <ThemedText fontSize={'xs'} fontWeight={'light'}>
                                {manufacturer.name}
                            </ThemedText>
                        )}
                    </View>

                    <HStack alignItems={'center'} space={1}>
                        <Icon name={'signal-cellular-alt'} size={14} color={iconColor} />
                        <ThemedText fontSize={'xs'} fontWeight={'light'}>
                            {isScanActive && rssi ? `${rssi} dBm` : 'N/A'}
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
        marginBottom: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
