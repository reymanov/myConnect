import React from 'react';
import { Text, View } from 'native-base';
import { StyleSheet } from 'react-native';
import { GenericListItem } from './GenericListItem';

interface Props {
    label?: string;
    items: GenericListItem[];
}

export const GenericList: React.FC<Props> = ({ label, items }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            {items.map((item, idx) => (
                <GenericListItem
                    key={item.title}
                    item={item}
                    index={idx}
                    totalLength={items.length}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 24,
    },
    label: {
        marginLeft: 16,
        marginBottom: 4,
        fontSize: 16,
        color: 'gray',
    },
});
