import React, { useDebugValue } from 'react';
import { StyleSheet } from 'react-native';
import ThemedText from '@components/general/texts/ThemedText';
import ThemedContainer from '@src/containers/ThemedContainer';
import { RouteProp, useRoute } from '@react-navigation/native';
import { TScannerNavigationProp } from '@navigation/types/TScannerNavigationProp';
import { useSelectDeviceById } from '@store/devices';
import { Button, Text, useTheme } from 'native-base';
import { bleActions, useSelectIsDeviceConnected } from '@store/ble';
import { BleManager } from 'react-native-ble-plx';
import { useDispatch } from 'react-redux';

const manager = new BleManager();

export const DeviceScreen = () => {
    const route = useRoute<RouteProp<TScannerNavigationProp, 'Device'>>();
    const device = useSelectDeviceById(route.params.id);
    const isConnected = useSelectIsDeviceConnected(route.params.id);
    const { colors } = useTheme();
    const dispatch = useDispatch();

    const handleButtonPress = async () => {
        if (!device) return;
        if (isConnected) {
            await manager.cancelDeviceConnection(device.id);
            dispatch(bleActions.selectConnectedDeviceId(null));
        } else {
            await manager.connectToDevice(device.id);
            dispatch(bleActions.selectConnectedDeviceId(device.id));
            const dev = await manager.discoverAllServicesAndCharacteristicsForDevice(device.id);
            delete dev._manager;
            console.log(dev);
        }
    };

    if (!device) return null;
    const { name, manufacturer } = device;

    return (
        <ThemedContainer style={styles.container}>
            <ThemedText>{name}</ThemedText>
            {manufacturer.name && (
                <>
                    <ThemedText>{manufacturer.name}</ThemedText>
                    <ThemedText>{`<${manufacturer.code}>`}</ThemedText>
                </>
            )}
            <Button rounded={'md'} size={'xs'} onPress={handleButtonPress}>
                <Text color={colors.white} fontWeight={'medium'}>
                    {isConnected ? 'Disconnect' : 'Connect'}
                </Text>
            </Button>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
