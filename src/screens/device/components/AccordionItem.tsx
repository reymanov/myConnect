import React, { useState } from 'react';
import { HStack, Text, useClipboard, useColorMode, useTheme, useToast } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Characteristic } from 'react-native-ble-plx';
import useBle from '@hooks/useBle';
import { DarkTheme } from '@react-navigation/native';
import { WriteModal } from './WriteModal';

const LIST_ITEM_HEIGHT = 130;

interface Props {
    characteristic: Characteristic;
    isLast: boolean;
}

export const AccordionItem: React.FC<Props> = ({ characteristic, isLast }) => {
    const [isWriteModalVisible, setIsWriteModalVisible] = useState(false);
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
    const { readCharacteristicValue } = useBle();
    const { onCopy } = useClipboard();
    const toast = useToast();

    const properties = [];

    if (isReadable) properties.push('Read');
    if (isNotifiable) properties.push('Notify');
    if (isWritableWithResponse) properties.push('Write');
    if (isIndicatable || isWritableWithoutResponse) properties.push('and more...');

    const copyToClipboard = async (text: string | null) => {
        if (!text) return;
        try {
            await onCopy(text);
            toast.show({
                description: 'Copied to clipboard ✓',
                placement: 'bottom',
                duration: 1500,
            });
        } catch (e) {
            console.error('Copying to clipboard error', e);
        }
    };

    const onReadValue = async () => {
        try {
            const value = await readCharacteristicValue(
                characteristic.deviceID,
                characteristic.serviceUUID,
                characteristic.uuid
            );
            setValue(value);
        } catch (e) {
            console.error('Reading characteristic value error', e);
        }
    };

    const onWriteValue = async () => {};

    const backgroundColor = colorMode === 'dark' ? DarkTheme.colors.card : colors.white;

    return (
        <>
            <WriteModal
                isOpen={isWriteModalVisible}
                onClose={() => setIsWriteModalVisible(false)}
                onWrite={onWriteValue}
            />

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
                    <Text numberOfLines={1}>Value: {value || 'N/A'}</Text>

                    <View style={styles.indicatorSmall} />
                    <HStack style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.iconButton, { backgroundColor: colors.cyan[600] }]}
                            onPress={() => copyToClipboard(value || 'N/A')}
                        >
                            <Icon name="copy" size={18} color={colors.white} />
                        </TouchableOpacity>
                        <HStack>
                            {isReadable && (
                                <TouchableOpacity
                                    onPress={onReadValue}
                                    style={[
                                        styles.iconButton,
                                        { backgroundColor: colors.cyan[600] },
                                    ]}
                                >
                                    <Icon name="arrow-down" size={20} color={colors.white} />
                                </TouchableOpacity>
                            )}
                            {isWritableWithResponse || isWritableWithoutResponse ? (
                                <TouchableOpacity
                                    onPress={() => setIsWriteModalVisible(true)}
                                    style={[
                                        styles.iconButton,
                                        { backgroundColor: colors.cyan[600] },
                                    ]}
                                >
                                    <Icon name="arrow-up" size={20} color={colors.white} />
                                </TouchableOpacity>
                            ) : null}
                        </HStack>
                    </HStack>
                </View>
            </View>
        </>
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
        marginHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
    },
    actionButtons: {
        marginTop: 2,
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        paddingLeft: 16,
    },
});
