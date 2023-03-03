import React, { useState } from 'react';
import { Service } from 'react-native-ble-plx';
import { DarkTheme, RouteProp, useRoute } from '@react-navigation/native';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { Button, ScrollView, Text, useColorMode, useTheme } from 'native-base';

import useBle from '@hooks/useBle';
import { Accordion } from './components/Accordion';
import { AnimatedDots } from '@components/animated';
import { decodeManufacturerData } from '@utils/BleUtils';
import ThemedContainer from '@containers/ThemedContainer';
import { triggerHapticFeedback } from '@utils/HapticFeedback';
import { TScannerNavigationProp } from '@navigation/types/TScannerNavigationProp';

export const DeviceScreen: React.FC = () => {
    const route = useRoute<RouteProp<TScannerNavigationProp, 'Device'>>();
    const [isConnecting, setIsConnecting] = useState(false);
    const [isDiscovering, setIsDiscovering] = useState(false);
    const [services, setServices] = useState<Service[] | []>([]);
    const { colorMode } = useColorMode();
    const { colors } = useTheme();

    const device = route.params.device;

    const {
        connectedDevice,
        connectToDevice,
        disconnectFromDevice,
        discoverAllServicesAndCharacteristics,
    } = useBle();

    if (!device) return null;

    const backgroundColor = colorMode === 'dark' ? DarkTheme.colors.card : colors.white;

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

        triggerHapticFeedback('impactLight');
    };

    const onDiscoverServicesAndCharacteristics = async () => {
        try {
            setIsDiscovering(true);
            const data = await discoverAllServicesAndCharacteristics(device);
            if (!data) return;
            setServices(data.services);
        } catch (e) {
            console.error('Discovering services error', e);
        } finally {
            setTimeout(() => {
                setIsDiscovering(false);
            }, 500);
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
                        <Text color={'#fff'}>
                            Connecting
                            <AnimatedDots color={'#fff'} />
                        </Text>
                    ) : (
                        <Text color={'#fff'}>Connect</Text>
                    )}
                </Button>
                <Button style={styles.button} isDisabled={!isConnected} onPress={onDisconnect}>
                    Disconnect
                </Button>
                <Button
                    style={styles.button}
                    isDisabled={!isConnected || isDiscovering}
                    onPress={onDiscoverServicesAndCharacteristics}
                >
                    Discover services
                </Button>
            </View>

            <ScrollView style={styles.informations}>
                <Text>Device</Text>
                <View style={[styles.section, { backgroundColor }]}>
                    <Text fontSize={18} lineHeight={28}>
                        {name || 'N/A'}
                    </Text>
                    <Text fontSize={14}>{id}</Text>
                </View>

                <Text>Manufacturer</Text>
                <View style={[styles.section, { backgroundColor }]}>
                    {manufacturer?.code ? (
                        <View>
                            <Text fontSize={14}>{manufacturer?.name || 'N/A'}</Text>
                            <Text fontSize={14}>{`<${manufacturer?.code}>`}</Text>
                        </View>
                    ) : (
                        <Text fontSize={14}>N/A</Text>
                    )}
                </View>

                <Text>Attributes</Text>
                {isDiscovering ? (
                    <ActivityIndicator style={{ marginTop: '15%' }} />
                ) : (
                    <View>
                        {services.map(service => (
                            <Accordion key={service.id} service={service} />
                        ))}
                    </View>
                )}
            </ScrollView>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingBottom: 0,
    },
    informations: {
        paddingTop: 24,
        flex: 1,
    },
    section: {
        width: '100%',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 2,
        marginBottom: 12,
    },
    buttons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        minWidth: '28%',
        borderRadius: 8,
    },
});
