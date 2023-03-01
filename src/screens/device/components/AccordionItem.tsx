import React, { useState } from 'react';
import { Text, useClipboard, useColorMode, useTheme, useToast, VStack } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Characteristic } from 'react-native-ble-plx';
import { triggerHapticFeedback } from '@utils/HapticFeedback';

const LIST_ITEM_HEIGHT = 130;

interface Props {
    characteristic: Characteristic;
    isLast: boolean;
}

export const AccordionItem: React.FC<Props> = ({ characteristic, isLast }) => {
    const [value, setValue] = useState<string | null>(null);
    const {
        uuid,
        isReadable,
        isNotifiable,
        isWritableWithResponse,
        isIndicatable,
        isWritableWithoutResponse,
    } = characteristic;
    const { colorMode } = useColorMode();
    const { colors } = useTheme();

    const { onCopy } = useClipboard();
    const toast = useToast();

    const properties = [];

    if (isReadable) properties.push('Read');
    if (isNotifiable) properties.push('Notify');
    if (isWritableWithResponse) properties.push('Write');
    if (isIndicatable || isWritableWithoutResponse) properties.push('and more...');

    const copyToClipboard = async (text: string | null) => {
        console.log(text);
        if (!text) return;
        try {
            await onCopy(text);
            triggerHapticFeedback('notificationSuccess');
            toast.show({
                description: 'Copied to clipboard ✓',
                placement: 'top',
                duration: 1500,
            });
        } catch (e) {
            console.error('Copying to clipboard error', e);
        }
    };

    const backgroundColor = colorMode === 'dark' ? colors.dark[100] : colors.white;

    return (
        <View
            style={[
                styles.container,
                {
                    borderBottomLeftRadius: isLast ? 8 : 0,
                    borderBottomRightRadius: isLast ? 8 : 0,

                    backgroundColor,
                },
            ]}
        >
            <View style={styles.content}>
                <View style={styles.indicatorBig} />
                <Text fontWeight={600}>Unknown Characteristics</Text>
                <Text>UUID: {uuid} </Text>
                <Text>
                    Properties:{' '}
                    {properties.length >= 2 ? properties.join(' and ') : properties.join(', ')}
                </Text>
                <Text>Value: {value || 'N/A'}</Text>

                <View style={styles.indicatorSmall} />
                <VStack style={{ marginTop: 2 }}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => copyToClipboard(value || 'N/A')}
                    >
                        <Icon name="copy" size={20} color={colors.gray[400]} />
                    </TouchableOpacity>
                </VStack>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: LIST_ITEM_HEIGHT,
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: 'lightgray',
    },
    indicatorBig: {
        position: 'absolute',
        left: 0,
        top: 6,
        bottom: 32,
        width: 4,
        backgroundColor: 'lightgray',
        borderRadius: 2,
    },
    indicatorSmall: {
        position: 'absolute',
        left: 0,
        top: 86,
        bottom: 0,
        width: 4,
        backgroundColor: 'lightgray',
        borderRadius: 2,
    },
    iconButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingLeft: 16,
    },
});
