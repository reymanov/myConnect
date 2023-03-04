import Modal from 'react-native-modal';
import React, { useState } from 'react';
import { DarkTheme } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Text, useColorMode, useTheme, View } from 'native-base';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

const valueTypes = ['ByteArray', 'UInt', 'Bool', 'UTF-8'];
const writeTypes = ['Command', 'Request'];

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onWrite: (value: string, type: string) => void;
}

export const WriteModal: React.FC<Props> = ({ isOpen, onClose, onWrite }) => {
    const [valueIndex, setValueIndex] = useState(0);
    const [writeIndex, setWriteIndex] = useState(0);
    const [value, setValue] = useState<any>('');

    const { colorMode } = useColorMode();
    const { colors } = useTheme();

    const tintColor = colors.cyan[600];
    const bgHeader = colorMode === 'dark' ? DarkTheme.colors.card : colors.white;
    const bgContent = colorMode === 'dark' ? colors.dark[50] : colors.gray[100];

    const handleWrite = () => {
        onWrite(value, valueTypes[valueIndex]);
        onClose();
    };

    const handleValueIndexChange = (event: any) => {
        setValueIndex(event.nativeEvent.selectedSegmentIndex);
    };

    const handleWriteIndexChange = (event: any) => {
        setWriteIndex(event.nativeEvent.selectedSegmentIndex);
    };

    return (
        <View>
            <Modal
                isVisible={isOpen}
                onDismiss={onClose}
                onBackdropPress={onClose}
                animationIn={'fadeIn'}
                animationOut={'fadeOut'}
            >
                <View style={[styles.modal, { backgroundColor: bgContent }]}>
                    <View style={[styles.header, { backgroundColor: bgHeader }]}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text fontSize={18} color={colors.cyan[600]}>
                            Write value
                        </Text>
                    </View>

                    <View style={styles.content}>
                        <Input
                            variant={'filled'}
                            backgroundColor={bgHeader}
                            placeholder="Enter value"
                            fontSize={14}
                            value={value}
                            onChange={setValue}
                        />

                        <Text style={styles.controlLabel}>Value Type</Text>
                        <SegmentedControl
                            values={valueTypes}
                            selectedIndex={valueIndex}
                            tintColor={tintColor}
                            onChange={handleValueIndexChange}
                        />

                        <Text style={styles.controlLabel}>Write Type</Text>
                        <SegmentedControl
                            values={writeTypes}
                            selectedIndex={writeIndex}
                            tintColor={tintColor}
                            onChange={handleWriteIndexChange}
                        />
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={handleWrite} style={styles.writeButton}>
                            <Text style={[styles.writeText, { color: colors.cyan[600] }]}>
                                Write
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modal: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    cancelButton: {
        position: 'absolute',
        left: 8,
        padding: 8,
    },
    cancelText: {
        color: 'red',
        fontSize: 16,
    },
    content: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    footer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        width: '100%',
        alignItems: 'center',
    },
    writeButton: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    writeText: {
        fontSize: 18,
        color: 'white',
    },
    controlLabel: {
        marginTop: 16,
        marginBottom: 4,
        fontSize: 16,
    },
});
