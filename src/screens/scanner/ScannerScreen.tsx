import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ThemedContainer from '@src/containers/ThemedContainer';
import { DiscoveredDevice, MyConnectLogo } from './components';

export const ScannerScreen = () => {
    const navigation = useNavigation();

    const devices: any[] = [
        { name: 'Device one', rssi: '-65' },
        { name: 'Device two', rssi: '-32' },
        { name: 'Device three', rssi: '-82' },
    ];

    const navigateToDevice = () => {
        navigation.navigate('Device');
    };

    return (
        <ThemedContainer style={styles.container}>
            <View style={styles.logo}>
                <MyConnectLogo />
            </View>

            <ScrollView>
                {devices.map(({ name, rssi }) => (
                    <DiscoveredDevice
                        key={name}
                        name={name}
                        rssi={rssi}
                        onPress={navigateToDevice}
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
    logo: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
});
