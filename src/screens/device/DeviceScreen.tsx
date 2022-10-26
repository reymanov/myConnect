import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import { decodeManufacturerData } from '@utils/BleUtils';
import ThemedContainer from '@containers/ThemedContainer';
import ThemedText from '@components/general/texts/ThemedText';
import { TScannerNavigationProp } from '@navigation/types/TScannerNavigationProp';

export const DeviceScreen: React.FC = () => {
    const route = useRoute<RouteProp<TScannerNavigationProp, 'Device'>>();
    const device = route.params.device;

    console.log(device);

    if (!device) return null;
    const { name, manufacturerData } = device;
    const manufacturer = decodeManufacturerData(manufacturerData);

    return (
        <ThemedContainer style={styles.container}>
            <ThemedText>{name}</ThemedText>
            {manufacturer?.name && (
                <View>
                    <ThemedText>{manufacturer.name}</ThemedText>
                    <ThemedText>{`<${manufacturer.code}>`}</ThemedText>
                </View>
            )}
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
