import React, { ReactNode } from 'react';
import { DarkTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { HStack, Text, useColorMode, useTheme, View } from 'native-base';

export interface GenericListItem {
    icon: string;
    title: string;
    element?: ReactNode;
    isTouchable?: boolean;
    onPress?: () => void;
}

interface Props {
    item: GenericListItem;
    index: number;
    totalLength: number;
}

export const GenericListItem: React.FC<Props> = ({ item, index, totalLength }) => {
    const { colorMode } = useColorMode();
    const { colors } = useTheme();

    const { icon, title, element, isTouchable, onPress } = item;

    const isFirst = index === 0;
    const isLast = index === totalLength - 1;
    const isOnly = isFirst && isLast;

    const iconColor = colorMode === 'dark' ? colors.white : colors.black;
    const separatorColor = colorMode === 'dark' ? colors.gray[800] : colors.gray[200];
    const backgroundColor = colorMode === 'dark' ? DarkTheme.colors.card : colors.white;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!isTouchable}
            style={[
                styles.container,
                { backgroundColor },
                isFirst && styles.first,
                isLast && styles.last,
                isOnly && styles.only,
            ]}
        >
            <HStack>
                <Icon name={icon} size={20} color={iconColor} style={styles.icon} />
                <Text fontSize={16}>{title}</Text>
            </HStack>
            <View style={styles.element}>
                {isTouchable && <Icon name="chevron-forward" size={20} color={iconColor} />}
                {!isTouchable && element}
            </View>

            {!isLast && !isOnly && (
                <View style={[styles.separator, { backgroundColor: separatorColor }]} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    first: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    last: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    only: {
        borderRadius: 8,
    },
    separator: {
        position: 'absolute',
        bottom: 0,
        left: 16,
        right: 16,
        width: '100%',
        height: 1,
    },
    icon: {
        marginRight: 16,
    },
    element: {
        position: 'absolute',
        right: 16,
    },
});
