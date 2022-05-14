import React from 'react';
import { StyleSheet } from 'react-native';
import ThemedText from '@components/texts/ThemedText';
import ThemedContainer from '@components/containers/ThemedContainer';

export const SettingsScreen = () => {
    return (
        <ThemedContainer style={styles.container}>
            <ThemedText>Settings</ThemedText>
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
