import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useColorMode, useTheme } from 'native-base';

interface ItemProps {
    height: number | string;
    isActive: boolean;
}

const SignalItem: React.FC<ItemProps> = ({ height, isActive }) => {
    const { colorMode } = useColorMode();
    const { colors } = useTheme();
    const isDarkMode = colorMode === 'dark';
    const dark = {
        backgroundColor: colors.dark[100],
    };

    const darkActive = {
        borderWidth: 2,
        borderColor: colors.dark[100],
        backgroundColor: colors.dark[400],
    };

    const light = {
        backgroundColor: colors.dark[700],
    };

    const lightActive = {
        borderWidth: 2,
        borderColor: colors.dark[700],
        backgroundColor: colors.dark[400],
    };

    const disabled = isDarkMode ? dark : light;
    const active = isDarkMode ? darkActive : lightActive;

    const style = isActive ? active : disabled;

    return <View style={[styles.item, { height }, style]} />;
};

interface Props {
    rssi: number | null;
}

export const SignalStrength: React.FC<Props> = ({ rssi }) => {
    return (
        <View style={styles.container}>
            <SignalItem height={'30%'} isActive={rssi && rssi >= -90 ? true : false} />
            <SignalItem height={'60%'} isActive={rssi && rssi >= -75 ? true : false} />
            <SignalItem height={'90%'} isActive={rssi && rssi >= -60 ? true : false} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 26,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    item: {
        width: 10,
        margin: 1,
        borderRadius: 2,
    },
});
