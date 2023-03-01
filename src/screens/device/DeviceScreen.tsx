import React, { useState } from 'react';
import {
    Button,
    ScrollView,
    Text,
    useClipboard,
    useColorMode,
    useTheme,
    useToast,
} from 'native-base';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Characteristic, Service } from 'react-native-ble-plx';

import useBle from '@hooks/useBle';
import { AnimatedDots } from '@components/animated';
import { decodeManufacturerData } from '@utils/BleUtils';
import ThemedContainer from '@containers/ThemedContainer';
import { triggerHapticFeedback } from '@utils/HapticFeedback';
import { TScannerNavigationProp } from '@navigation/types/TScannerNavigationProp';
import { Accordion } from './components/Accordion';

export const DeviceScreen: React.FC = () => {
    const route = useRoute<RouteProp<TScannerNavigationProp, 'Device'>>();
    const [isConnecting, setIsConnecting] = useState(false);
    const [isDiscovering, setIsDiscovering] = useState(false);
    const [services, setServices] = useState<Service[] | []>([]);
    const [characteristics, setCharacteristics] = useState<Characteristic[] | []>([]);
    const { colorMode } = useColorMode();
    const { onCopy } = useClipboard();
    const { colors } = useTheme();
    const toast = useToast();

    const device = route.params.device;

    const {
        connectedDevice,
        connectToDevice,
        disconnectFromDevice,
        discoverAllServicesAndCharacteristics,
    } = useBle();

    if (!device) return null;

    const backgroundColor = colorMode === 'dark' ? colors.gray[800] : colors.white;

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
        triggerHapticFeedback('impactLight');
    };

    const onDiscoverServicesAndCharacteristics = async () => {
        try {
            setIsDiscovering(true);
            const data = await discoverAllServicesAndCharacteristics(device);
            if (!data) return;

            const { services, characteristics } = data;
            setServices(services);
            setCharacteristics(characteristics);
        } catch (e) {
            console.error('Discovering services and characteristics error', e);
        } finally {
            setIsDiscovering(false);
        }
    };

    const copyToClipboard = async (text: string | null) => {
        if (!text) return;
        try {
            await onCopy(text);
            triggerHapticFeedback('notificationSuccess');
            toast.show({
                description: 'Copied to clipboard ✓',
                placement: 'top',
                duration: 1500,
            });
        } catch (e) {
            console.error('Copying to clipboard error', e);
        }
    };

    const manufacturerText = manufacturer ? `${manufacturer.name} <${manufacturer.code}>` : 'N/A';

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
                    <Text fontSize={18} fontWeight={500} lineHeight={28}>
                        {name}
                    </Text>
                    <Text fontSize={14} fontWeight={500}>
                        {id}
                    </Text>
                </View>

                <Text>Manufacturer</Text>
                <View style={[styles.section, { backgroundColor }]}>
                    <Text fontSize={16} fontWeight={500}>
                        {manufacturer?.name}
                    </Text>
                    <Text fontSize={14} fontWeight={500}>
                        {`<${manufacturer?.code}>`}
                    </Text>
                </View>

                <Text>Attributes</Text>
                {services.map(service => (
                    <Accordion service={service} characteristics={characteristics} />
                ))}
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
