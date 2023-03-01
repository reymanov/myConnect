import React from 'react';
import { Device } from 'react-native-ble-plx';
import { DarkTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { HStack, Spacer, useColorMode, useTheme, View, VStack } from 'native-base';

import { decodeManufacturerData } from '@utils/BleUtils';
import ThemedText from '@components/general/texts/ThemedText';
import { SignalStrength } from '@components/scanner/SignalStrength';

interface Props {
    device: Device;
    isScanActive: boolean;
    onPress: () => void;
}

export const DeviceListItem: React.FC<Props> = ({ device, isScanActive, onPress }) => {
    const { colorMode } = useColorMode();
    const { colors } = useTheme();

    const isDarkMode = colorMode === 'dark';
    const backgroundColor = isDarkMode ? DarkTheme.colors.card : colors.white;
    const iconColor = colors.dark[400];

    const { id, name, rssi, manufacturerData } = device;

    const manufacturer = decodeManufacturerData(manufacturerData);

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
                            <ThemedText fontSize={'xs'}>{manufacturer.name}</ThemedText>
                        )}
                        <ThemedText fontSize={'xs'} color={'gray.500'}>
                            {id}
                        </ThemedText>
                    </View>

                    <HStack alignItems={'center'} space={1}>
                        <Icon name={'signal-cellular-alt'} size={14} color={iconColor} />
                        <ThemedText fontSize={'xs'} fontWeight={'light'}>
                            {isScanActive && rssi ? `${rssi} dBm` : 'N/A'}
                        </ThemedText>
                    </HStack>
                </VStack>

                <Spacer />
            </HStack>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        minHeight: 80,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 8,
        marginHorizontal: 8,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
