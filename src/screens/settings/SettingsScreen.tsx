import React from 'react';
import { StyleSheet } from 'react-native';
import ThemedContainer from '@src/containers/ThemedContainer';

export const SettingsScreen = () => {
    return <ThemedContainer style={styles.container}></ThemedContainer>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
