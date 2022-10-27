import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Device } from 'react-native-ble-plx';
import { DarkTheme, useNavigation } from '@react-navigation/native';
import { View, StyleSheet, RefreshControl, FlatList } from 'react-native';

import useBle from '@hooks/useBle';
import { HapticFeedback } from '@utils/HapticFeedback';
import ThemedContainer from '@containers/ThemedContainer';
import { useSelectIsScanning } from '@store/ble';
import { MyConnectLogo } from '@components/scanner/MyConnectLogo';
import { DeviceListItem } from '@components/scanner/DeviceListItem';
import ThemedText from '@components/general/texts/ThemedText';
import { Text } from 'native-base';
import devices from '@store/devices';

export const ScannerScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const isScanning = useSelectIsScanning();
    const dispatch = useDispatch();

    const {
        allDevices,
        connectedDevice,
        scanForPeripherals,
        connectToDevice,
        disconnectFromDevice,
        stopScan,
        clearDevices,
    } = useBle();

    const navigateToDevice = (device: Device) => {
        navigation.navigate('Device', { device });
    };

    const onRefresh = () => {
        HapticFeedback('impactLight');
        clearDevices();
    };

    useEffect(() => {
        if (isScanning) scanForPeripherals();
        else stopScan();
    }, [isScanning]);

    const handleButtonPress = async (deviceId: string) => {
        const device = allDevices.find(d => d.id === deviceId);
        if (!device) return;
        const isConnected = connectedDevice?.id === deviceId;
        if (isConnected) {
            try {
                disconnectFromDevice();
            } catch (e) {
                console.error('Disconnecting error', e);
            }
        } else {
            try {
                await connectToDevice(device);
                navigateToDevice(device);
            } catch (e) {
                console.error('Connecting error', e);
            }
        }
    };

    return (
        <ThemedContainer style={styles.container}>
            <View style={styles.logo}>
                <MyConnectLogo />
            </View>

            <View style={styles.header}>
                <Text fontWeight={'medium'} color={'dark.600'}>
                    Select device
                </Text>
                <Text fontWeight={'medium'} color={'dark.600'}>
                    Discovered: {allDevices.length}
                </Text>
            </View>

            <FlatList
                refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
                keyExtractor={item => item.id}
                data={allDevices}
                renderItem={({ item }: { item: Device }) => {
                    return (
                        <DeviceListItem
                            key={item.id}
                            device={item}
                            isScanActive={isScanning}
                            onPress={() => navigateToDevice(item)}
                        />
                    );
                }}
            />
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 42,
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
});
