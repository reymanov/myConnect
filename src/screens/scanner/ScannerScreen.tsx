import { useTheme } from 'native-base';
import { Device } from 'react-native-ble-plx';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { View, StyleSheet, RefreshControl, FlatList } from 'react-native';

import useBle from '@hooks/useBle';
import { Pulse } from '@components/animated';
import { useSelectIsScanning } from '@store/ble';
import ThemedContainer from '@containers/ThemedContainer';
import { MyConnectLogo } from './components/MyConnectLogo';
import { DeviceListItem } from './components/DeviceListItem';
import { ScannerTooltip } from './components/ScannerTooltip';

export const ScannerScreen: React.FC = () => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(true);

    const { allDevices, scanForPeripherals, stopScan, clearDevices } = useBle();
    const { navigate } = useNavigation<any>();
    const isScanning = useSelectIsScanning();
    const { colors } = useTheme();

    const navigateToDevice = (device: Device) => {
        stopScan();
        navigate('Device', { device });
    };

    const onRefresh = () => {
        clearDevices();
    };

    useEffect(() => {
        if (isScanning) scanForPeripherals();
        else stopScan();
    }, [isScanning]);

    useEffect(() => {
        setTimeout(() => {
            setIsTooltipVisible(false);
        }, 3000);
        if (isScanning) setIsTooltipVisible(false);
    }, [isScanning]);

    const isAnimationVisible = isScanning && allDevices.length === 0;

    return (
        <ThemedContainer style={styles.container}>
            {isTooltipVisible && <ScannerTooltip />}

            <View style={styles.logo}>
                <MyConnectLogo />
                {isAnimationVisible && <Pulse size={60} color={colors.cyan[600]} />}
            </View>

            <FlatList
                style={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
                keyExtractor={item => item.id}
                data={allDevices}
                renderItem={({ item }: { item: Device }) => {
                    return (
                        <Animated.View entering={FadeInUp} exiting={FadeOutUp} key={item.id}>
                            <DeviceListItem
                                device={item}
                                isScanActive={isScanning}
                                onPress={() => navigateToDevice(item)}
                            />
                        </Animated.View>
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
