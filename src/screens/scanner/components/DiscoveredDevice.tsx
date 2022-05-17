import React from 'react';
import { DarkTheme } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, HStack, Spacer, Text, useColorMode, useTheme, View, VStack } from 'native-base';
import { HapticFeedback } from '@utils/HapticFeedback';
import { SignalStrength } from '@components/SignalStrength';
import { BleDevice } from '@store/ble';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemedText from '@components/texts/ThemedText';

interface Props {
    device: BleDevice;
    isScanActive: boolean;
    isConnected: boolean | null;
    onPress: () => void;
    onButtonPress: (id: string) => void;
}

export const DiscoveredDevice: React.FC<Props> = ({
    device,
    isScanActive,
    isConnected,
    onPress,
    onButtonPress,
}) => {
    const { colorMode } = useColorMode();
    const { colors } = useTheme();

    const isDarkMode = colorMode === 'dark';
    const backgroundColor = isDarkMode ? DarkTheme.colors.card : colors.white;
    const iconColor = colors.dark[400];

    const { id, name, rssi, lastUpdated, manufacturerData } = device;
    const isReachable = Date.now() - lastUpdated < 5000;

    const handleButtonPress = () => {
        HapticFeedback('impactLight');
        onButtonPress(id);
    };

    return (
        <TouchableOpacity style={[styles.item, { backgroundColor }]} onPress={onPress}>
            <HStack w={'full'} alignItems={'center'} space={4}>
                <VStack alignItems={'center'} space={1}>
                    <Icon name={'bluetooth'} size={28} color={iconColor} />
                    <SignalStrength rssi={isScanActive && isReachable ? rssi : null} />
                </VStack>

                <VStack space={'md'}>
                    <View>
                        <ThemedText fontSize={'md'} fontWeight={'medium'}>
                            {name || 'N/A'}
                        </ThemedText>
                        <ThemedText fontSize={'xs'} fontWeight={'light'}>
                            {manufacturerData.name}
                        </ThemedText>
                    </View>

                    <HStack alignItems={'center'} space={1}>
                        <Icon name={'signal-cellular-alt'} size={14} color={iconColor} />
                        <ThemedText fontSize={'xs'} fontWeight={'light'}>
                            {isReachable && isScanActive && rssi ? `${rssi} dBm` : 'N/A'}
                        </ThemedText>
                    </HStack>
                </VStack>

                <Spacer />

                <Button rounded={'md'} size={'xs'} onPress={handleButtonPress}>
                    <Text color={colors.white} fontWeight={'medium'}>
                        {isConnected ? 'Disconnect' : 'Connect'}
                    </Text>
                </Button>
            </HStack>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        minHeight: 80,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
