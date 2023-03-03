import React, { useEffect } from 'react';
import { Device } from 'react-native-ble-plx';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, RefreshControl, FlatList } from 'react-native';

import useBle from '@hooks/useBle';
import { useSelectIsScanning } from '@store/ble';
import { triggerHapticFeedback } from '@utils/HapticFeedback';
import ThemedContainer from '@containers/ThemedContainer';
import { MyConnectLogo } from '@components/scanner/MyConnectLogo';
import { DeviceListItem } from '@components/scanner/DeviceListItem';
import { Pulse } from '@components/animated';
import { useTheme } from 'native-base';

export const ScannerScreen: React.FC = () => {
    const { navigate } = useNavigation<any>();
    const isScanning = useSelectIsScanning();
    const { colors } = useTheme();

    const { allDevices, scanForPeripherals, stopScan, clearDevices } = useBle();

    const navigateToDevice = (device: Device) => {
        stopScan();
        navigate('Device', { device });
    };

    const onRefresh = () => {
        triggerHapticFeedback('impactLight');
        stopScan();
        clearDevices();
    };

    useEffect(() => {
        if (isScanning) scanForPeripherals();
        else stopScan();
    }, [isScanning]);

    return (
        <ThemedContainer style={styles.container}>
            <View style={styles.logo}>
                <MyConnectLogo />
                {isScanning && allDevices.length === 0 && (
                    <Pulse size={40} color={colors.cyan[600]} />
                )}
            </View>

            <FlatList
                style={styles.list}
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
        justifyContent: 'flex-end',
    },
    list: {
        paddingTop: 16,
    },
    logo: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
});
