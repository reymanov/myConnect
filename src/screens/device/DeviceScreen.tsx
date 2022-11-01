import React, { useState } from 'react';
import { Button, Text } from 'native-base';
import { Alert, StyleSheet, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Characteristic, Service } from 'react-native-ble-plx';

import useBle from '@hooks/useBle';
import { AnimatedDots } from '@components/animated';
import { decodeManufacturerData } from '@utils/BleUtils';
import ThemedContainer from '@containers/ThemedContainer';
import { triggerHapticFeedback } from '@utils/HapticFeedback';
import { TScannerNavigationProp } from '@navigation/types/TScannerNavigationProp';

export const DeviceScreen: React.FC = () => {
    const route = useRoute<RouteProp<TScannerNavigationProp, 'Device'>>();
    const [isConnecting, setIsConnecting] = useState(false);
    const [services, setServices] = useState<Service[] | []>([]);
    const [characteristics, setCharacteristics] = useState<Characteristic[] | []>([]);
    const device = route.params.device;

    const {
        connectedDevice,
        connectToDevice,
        disconnectFromDevice,
        discoverAllServicesAndCharacteristics,
    } = useBle();

    if (!device) return null;

    const { id, name, manufacturerData } = device;
    const manufacturer = decodeManufacturerData(manufacturerData);
    const isConnected = connectedDevice?.id === id;

    const onConnect = async () => {
        try {
            setIsConnecting(true);
            triggerHapticFeedback('impactLight');
            await connectToDevice(device);
            triggerHapticFeedback('notificationSuccess');
        } catch (e) {
            Alert.alert('Oops!', 'Failed to connect to device, please try again.');
            console.error('Connecting to device error', e);
        } finally {
            setIsConnecting(false);
        }
    };

    const onDisconnect = async () => {
        disconnectFromDevice();
        setServices([]);
        setCharacteristics([]);
        triggerHapticFeedback('impactLight');
    };

    const onDiscoverServicesAndCharacteristics = async () => {
        try {
            const data = await discoverAllServicesAndCharacteristics(device);
            if (!data) return;

            const { services, characteristics } = data;
            setServices(services);
            setCharacteristics(characteristics);
        } catch (e) {
            console.error('Discovering services and characteristics error', e);
        }
    };

    return (
        <ThemedContainer style={styles.container}>
            <View style={styles.buttons}>
                <Button
                    style={styles.button}
                    disabled={isConnecting}
                    isDisabled={isConnected}
                    onPress={onConnect}
                >
                    {isConnecting ? (
                        <Text>
                            Connecting
                            <AnimatedDots color={'#fff'} />
                        </Text>
                    ) : (
                        <Text>Connect</Text>
                    )}
                </Button>
                <Button style={styles.button} isDisabled={!isConnected} onPress={onDisconnect}>
                    Disconnect
                </Button>
                <Button
                    style={styles.button}
                    isDisabled={!isConnected}
                    onPress={onDiscoverServicesAndCharacteristics}
                >
                    Discover services
                </Button>
            </View>

            <View style={styles.informations}>
                <Text>{name}</Text>
                <Text>{id}</Text>
                {manufacturer?.name && (
                    <>
                        <Text>{manufacturer.name}</Text>
                        <Text>{`<${manufacturer.code}>`}</Text>
                    </>
                )}

                {/* Render a list of services with sublist of characteristics */}
                <Text>Services</Text>
                {services.map(service => (
                    <View key={service.uuid}>
                        <Text>{service.uuid}</Text>
                        {characteristics
                            .filter(characteristic => characteristic.serviceUUID === service.uuid)
                            .map(characteristic => (
                                <Text color={'gray.500'} key={characteristic.uuid}>
                                    {characteristic.uuid}
                                </Text>
                            ))}
                    </View>
                ))}
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    informations: {
        marginTop: 32,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        minWidth: '26%',
    },
});
