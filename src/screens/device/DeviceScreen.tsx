import React from 'react';
import { StyleSheet } from 'react-native';
import ThemedText from '@components/texts/ThemedText';
import ThemedContainer from '@components/containers/ThemedContainer';
import { RouteProp, useRoute } from '@react-navigation/native';
import { TScannerNavigationProp } from '@navigation/types/TScannerNavigationProp';
import { useSelectDeviceById } from '@store/devices';

export const DeviceScreen = () => {
    const route = useRoute<RouteProp<TScannerNavigationProp, 'Device'>>();
    const device = useSelectDeviceById(route.params.id);

    if (!device) return null;
    const { name, manufacturer } = device;

    return (
        <ThemedContainer style={styles.container}>
            <ThemedText>{name}</ThemedText>
            {manufacturer && (
                <>
                    <ThemedText>{manufacturer.name}</ThemedText>
                    <ThemedText>{`<${manufacturer.code}>`}</ThemedText>
                </>
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
