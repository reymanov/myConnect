import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, RefreshControl, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DiscoveredDevice } from './components/DiscoveredDevice';
import { useDispatch } from 'react-redux';
import { BleManager, ScanMode } from 'react-native-ble-plx';
import { HapticFeedback } from '@utils/HapticFeedback';
import useInterval from '@hooks/useInterval';
import { MyConnectLogo } from '@components/MyConnectLogo';
import ThemedContainer from '@components/containers/ThemedContainer';
import {
    bleActions,
    BleDevice,
    useSelectDiscoveredDeviceIds,
    useSelectDiscoveredDevices,
    useSelectIsScanning,
} from '@store/ble';

import { decodeManufacturerData } from '@utils/BleUtils';

const manager = new BleManager();

export const ScannerScreen = () => {
    const navigation = useNavigation();
    const discoveredDeviceIds = useSelectDiscoveredDeviceIds();
    const discoveredDevices = useSelectDiscoveredDevices();
    const isScanning = useSelectIsScanning();
    const dispatch = useDispatch();

    const navigateToDevice = () => {
        navigation.navigate('Device');
        dispatch(bleActions.stopScan());
    };

    const onRefresh = () => {
        HapticFeedback('impactLight');
        dispatch(bleActions.clearDiscoveredDevices());
    };

    const scanForDevices = useCallback(() => {
        manager.startDeviceScan(null, { scanMode: ScanMode.LowPower }, async (error, device) => {
            if (!device || !device.name) return;

            if (!discoveredDeviceIds.includes(device.id)) {
                delete device._manager;
                if (device.manufacturerData) {
                    const manufacturerData = decodeManufacturerData(device.manufacturerData);

                    const bleDevice = {
                        ...device,
                        manufacturerData,
                    };
                    dispatch(bleActions.addToDiscoveredDevices(bleDevice as BleDevice));
                    console.log(bleDevice);
                }
            } else {
                dispatch(bleActions.updateRssiForDevice({ id: device.id, rssi: device.rssi }));
            }

            if (error) {
                console.log(error);
            }
        });
    }, [dispatch, discoveredDeviceIds]);

    useEffect(() => {
        if (!isScanning) {
            manager.stopDeviceScan();
        }
    }, [isScanning]);

    useInterval(() => scanForDevices(), isScanning ? 1000 : null);

    return (
        <ThemedContainer style={styles.container}>
            <View style={styles.logo}>
                <MyConnectLogo />
            </View>

            <FlatList
                refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
                keyExtractor={item => item.id}
                data={discoveredDevices}
                renderItem={({ item }: { item: BleDevice }) => (
                    <DiscoveredDevice
                        key={item.id}
                        device={item}
                        isScanActive={isScanning}
                        isConnected={false}
                        onPress={navigateToDevice}
                        onButtonPress={() => {}}
                    />
                )}
            />
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 32,
    },
    logo: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
});
