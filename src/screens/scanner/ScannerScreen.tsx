import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, RefreshControl, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ThemedContainer from '@src/containers/ThemedContainer';
import { DiscoveredDevice } from './components/DiscoveredDevice';
import { useDispatch } from 'react-redux';
import { HapticFeedback } from '@src/utils/HapticFeedback';
import { MyConnectLogo } from '@src/components/MyConnectLogo';
import { BleManager, Device, ScanMode } from 'react-native-ble-plx';
import {
    bleActions,
    useSelectDiscoveredDeviceIds,
    useSelectDiscoveredDevices,
    useSelectIsScanning,
} from '@src/store/ble';

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
            if (device && device.name) {
                if (!discoveredDeviceIds.includes(device.id)) {
                    delete device._manager;
                    dispatch(bleActions.addToDiscoveredDevices(device));
                } else {
                    dispatch(bleActions.updateRssiForDevice({ id: device.id, rssi: device.rssi }));
                }
            }
            if (error) {
                console.log(error);
            }
        });
    }, [dispatch, discoveredDeviceIds]);

    useEffect(() => {
        if (!isScanning) return;
        scanForDevices();
        const interval = setInterval(() => {
            scanForDevices();
        }, 1000);

        return () => {
            clearInterval(interval);
            manager.stopDeviceScan();
        };
    }, [isScanning, dispatch, scanForDevices]);

    return (
        <ThemedContainer style={styles.container}>
            <View style={styles.logo}>
                <MyConnectLogo />
            </View>

            <FlatList
                refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
                keyExtractor={item => item.id}
                data={discoveredDevices}
                renderItem={({ item }: { item: Device }) => (
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
