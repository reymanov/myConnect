import React from 'react';
import { Device } from 'react-native-ble-plx';
import { DarkTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { HStack, Spacer, Text, useColorMode, useTheme, View, VStack } from 'native-base';

import { decodeManufacturerData } from '@utils/BleUtils';
import { SignalStrength } from './SignalStrength';

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
                        <Text fontSize={'md'} fontWeight={'medium'}>
                            {name || 'N/A'}
                        </Text>
                        {manufacturer?.name && <Text fontSize={'xs'}>{manufacturer.name}</Text>}
                        <Text fontSize={'xs'} color={'gray.500'}>
                            {id}
                        </Text>
                    </View>

                    <HStack alignItems={'center'} space={1}>
                        <Icon name={'signal-cellular-alt'} size={14} color={iconColor} />
                        <Text fontSize={'xs'} fontWeight={'light'}>
                            {isScanActive && rssi ? `${rssi} dBm` : 'N/A'}
                        </Text>
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
