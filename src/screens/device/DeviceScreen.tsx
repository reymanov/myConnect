import React from 'react';
import { StyleSheet } from 'react-native';
import ThemedText from '@components/texts/ThemedText';
import ThemedContainer from '@components/containers/ThemedContainer';

export const DeviceScreen = () => {
    return (
        <ThemedContainer style={styles.container}>
            <ThemedText>Device</ThemedText>
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
