import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import ThemedContainer from '@src/containers/ThemedContainer';
import { DiscoveredDevice } from './components';

export const ScannerScreen = () => {
    const devices = [
        { name: 'Device one', rssi: '-65' },
        { name: 'Device two', rssi: '-32' },
        { name: 'Device three', rssi: '-82' },
    ];

    return (
        <ThemedContainer style={styles.container}>
            <ScrollView>
                {devices.map(device => (
                    <DiscoveredDevice
                        name={device.name}
                        rssi={device.rssi}
                        onPress={() => {}}
                        onButtonPress={() => {}}
                    />
                ))}
            </ScrollView>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 32,
    },
});
