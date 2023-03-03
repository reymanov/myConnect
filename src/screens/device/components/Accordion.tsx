import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useColorMode, useTheme } from 'native-base';
import { Characteristic, Service } from 'react-native-ble-plx';
import Animated, {
    useAnimatedRef,
    measure,
    useSharedValue,
    useAnimatedStyle,
    useDerivedValue,
    withSpring,
    withTiming,
    runOnUI,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

import { clamp } from '@utils/helpers/animations';
import { AccordionItem } from './AccordionItem';
import { DarkTheme } from '@react-navigation/native';

interface Props {
    service: Service;
}

export const Accordion: React.FC<Props> = ({ service }) => {
    const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
    const aref = useAnimatedRef<View>();
    const open = useSharedValue(false);
    const progress = useDerivedValue(() => (open.value ? withSpring(1) : withTiming(0)));
    const height = useSharedValue(0);
    const { colorMode } = useColorMode();
    const { colors } = useTheme();

    const iconColor = colorMode === 'dark' ? colors.white : colors.black;
    const backgroundColor = colorMode === 'dark' ? DarkTheme.colors.card : colors.white;

    const headerStyle = useAnimatedStyle(() => ({
        borderBottomLeftRadius: progress.value === 0 ? 8 : 0,
        borderBottomRightRadius: progress.value === 0 ? 8 : 0,
    }));

    const iconStyle = useAnimatedStyle(() => {
        const rotation = clamp(progress.value * Math.PI, 0, Math.PI);
        return {
            transform: [{ rotateZ: `${rotation}rad` }],
        };
    });

    const listStyle = useAnimatedStyle(() => ({
        height: height.value * progress.value + 1,
        opacity: progress.value === 0 ? 0 : 1,
    }));

    useEffect(() => {
        const getCharacteristics = async () => {
            try {
                const chars = await service.characteristics();
                setCharacteristics(chars);
            } catch (e) {
                console.error('Error getting characteristics', e);
            }
        };
        getCharacteristics();
    }, [service]);

    const onHeaderPress = () => {
        if (height.value === 0) {
            runOnUI(() => {
                'worklet';
                const m = measure(aref);
                height.value = m!.height;
            })();
        }
        open.value = !open.value;
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={onHeaderPress}>
                <Animated.View style={[styles.header, { backgroundColor }, headerStyle]}>
                    <View>
                        <Text fontWeight={600}>
                            Unknown Service {service.isPrimary ? '- Primary' : null}
                        </Text>
                        <Text numberOfLines={1}>UUID: {service.uuid}</Text>
                    </View>
                    <Animated.View style={iconStyle}>
                        <Icon name={'chevron-down-outline'} size={20} color={iconColor} />
                    </Animated.View>
                </Animated.View>
            </Pressable>

            <Animated.View style={[styles.items, listStyle]}>
                <View ref={aref} collapsable={false}>
                    {characteristics.map((item, index) => (
                        <AccordionItem
                            key={item.id}
                            characteristic={item}
                            isLast={index === characteristics.length - 1}
                        />
                    ))}
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    header: {
        marginTop: 2,
        padding: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    items: {
        overflow: 'hidden',
    },
});
