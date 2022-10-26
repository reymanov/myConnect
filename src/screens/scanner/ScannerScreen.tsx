import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Device } from 'react-native-ble-plx';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, RefreshControl, FlatList } from 'react-native';

import useBle from '@hooks/useBle';
import { HapticFeedback } from '@utils/HapticFeedback';
import ThemedContainer from '@containers/ThemedContainer';
import { bleActions, useSelectIsScanning } from '@store/ble';
import { MyConnectLogo } from '@components/scanner/MyConnectLogo';
import { DeviceListItem } from '@components/scanner/DeviceListItem';

export const ScannerScreen: React.FC = () => {
    const navigation = useNavigation();
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
                dispatch(bleActions.selectConnectedDeviceId(null));
                HapticFeedback('impactLight');
            } catch (e) {
                console.error('Disconnecting error', e);
            }
        } else {
            try {
                await connectToDevice(device);
                dispatch(bleActions.stopScan());
                HapticFeedback('impactLight');
                // navigateToDevice(device.id);
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
                            isConnected={connectedDevice?.id === item.id}
                            onPress={() => navigateToDevice(item)}
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
