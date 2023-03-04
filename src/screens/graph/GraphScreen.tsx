import React from 'react';
import { Text } from 'native-base';
import { StyleSheet } from 'react-native';
import ThemedContainer from '@containers/ThemedContainer';

export const GraphScreen = () => {
    return (
        <ThemedContainer style={styles.container}>
            <Text>RSSI Graph</Text>
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
