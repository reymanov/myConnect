import React from 'react';
import { Text, View } from 'native-base';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const ScannerTooltip: React.FC = () => {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
            <Text style={styles.text}>Scan for nearby devices</Text>
            <View style={styles.arrow} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#0891b2',
    },
    text: {
        fontSize: 16,
        color: 'white',
    },
    arrow: {
        position: 'absolute',
        top: -8,
        right: 22,
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#0891b2',
    },
});
