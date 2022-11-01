import React from 'react';
import { Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Characteristic } from 'react-native-ble-plx';

const LIST_ITEM_HEIGHT = 50;

interface Props {
    characteristic: Characteristic;
    isLast: boolean;
    onPress: () => void;
}

export const AccordionItem: React.FC<Props> = ({ characteristic, isLast, onPress }) => {
    const { id } = characteristic;

    return (
        <View
            style={[
                styles.container,
                {
                    borderBottomLeftRadius: isLast ? 8 : 0,
                    borderBottomRightRadius: isLast ? 8 : 0,
                },
            ]}
        >
            <TouchableOpacity style={styles.content} onPress={onPress}>
                <Text>{id}</Text>
                <Icon name={'chevron-up-outline'} size={20} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: LIST_ITEM_HEIGHT,
        backgroundColor: 'lightgray',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
