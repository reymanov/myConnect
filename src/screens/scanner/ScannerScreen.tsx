import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, RefreshControl, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DiscoveredDevice } from '../../components/scanner/DiscoveredDevice';
import { useDispatch } from 'react-redux';
import { BleManager, Device } from 'react-native-ble-plx';
import { HapticFeedback } from '@utils/HapticFeedback';
import useInterval from '@hooks/useInterval';
import { MyConnectLogo } from '@components/scanner/MyConnectLogo';
import ThemedContainer from '@src/containers/ThemedContainer';
import { bleActions, useSelectIsScanning } from '@store/ble';

import { decodeManufacturerData, sanitizeDiscoveredDevice } from '@utils/BleUtils';
import {
    BleDevice,
    devicesActions,
    useSelectDiscoveredDeviceIds,
    useSelectDiscoveredDevices,
} from '@store/devices';

const manager = new BleManager();

export const ScannerScreen = () => {
    const navigation = useNavigation();
    const [devices, setDevices] = React.useState<Device[]>([]);
    const discoveredDeviceIds = useSelectDiscoveredDeviceIds();
    const discoveredDevices = useSelectDiscoveredDevices();
    const isScanning = useSelectIsScanning();
    const dispatch = useDispatch();

    const navigateToDevice = (id: string) => {
        navigation.navigate('Device', { id });
        dispatch(bleActions.stopScan());
    };

    const onRefresh = () => {
        HapticFeedback('impactLight');
        dispatch(devicesActions.clearDiscovered());
    };

    const scanForDevices = useCallback(() => {
        manager.startDeviceScan(null, null, async (error, device) => {
            if (!device || !device.name) return;
            const { id, rssi, manufacturerData } = device;
            if (!discoveredDeviceIds.includes(id)) {
                const bleDevice = sanitizeDiscoveredDevice(device);
                dispatch(devicesActions.addToDiscovered(bleDevice));
                setDevices(prevDevices => [...prevDevices, bleDevice]);

                if (manufacturerData) {
                    const manufacturer = decodeManufacturerData(manufacturerData);

                    const manufacturerUpdate = {
                        id,
                        manufacturer,
                    };
                    dispatch(devicesActions.updateManufacturerData(manufacturerUpdate));
                }
            } else {
                if (!rssi) return;
                dispatch(devicesActions.updateRssi({ id, rssi }));
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

    const handleButtonPress = async (deviceId: string) => {
        const device = devices.find(d => d.id === deviceId);
        if (!device) return;

        const isConnected = await manager.isDeviceConnected(device.id);

        if (isConnected) {
            try {
                await manager.cancelDeviceConnection(device.id);
                dispatch(bleActions.selectConnectedDeviceId(null));
                HapticFeedback('impactLight');
            } catch (e) {
                console.log('Disconnecting error', e);
            }
        } else {
            try {
                await manager.connectToDevice(device.id);
                dispatch(bleActions.selectConnectedDeviceId(device.id));
                HapticFeedback('impactLight');

                navigateToDevice(device.id);
            } catch (e) {
                console.log('Connecting error', e);
            }
        }
    };

    return (
        <ThemedContainer style={styles.container}>
            <View style={styles.logo}>
                <MyConnectLogo />
            </View>

            <FlatList
                refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
                keyExtractor={item => item.id}
                data={discoveredDevices}
                renderItem={({ item }: { item: BleDevice }) => {
                    return (
                        <DiscoveredDevice
                            key={item.id}
                            device={item}
                            isScanActive={isScanning}
                            onPress={() => navigateToDevice(item.id)}
                            onButtonPress={() => handleButtonPress(item.id)}
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
        paddingTop: 32,
    },
    logo: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
});
