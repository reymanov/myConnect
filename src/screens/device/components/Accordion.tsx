import React from 'react';
import { Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Characteristic, Service } from 'react-native-ble-plx';
import { Pressable, StyleSheet, View } from 'react-native';
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

import { clamp } from '@utils/helpers/animations';
import { AccordionItem } from './AccordionItem';

interface Props {
    service: Service;
    characterstics: Characteristic[];
}

export const Accordion: React.FC<Props> = ({ service, characterstics }) => {
    const aref = useAnimatedRef<View>();
    const open = useSharedValue(false);
    const progress = useDerivedValue(() => (open.value ? withSpring(1) : withTiming(0)));
    const height = useSharedValue(0);

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

    const onHeaderPress = () => {
        if (height.value === 0) {
            runOnUI(() => {
                'worklet';
                const m = measure(aref);
                height.value = m.height;
            })();
        }
        open.value = !open.value;
    };

    return (
        <>
            <Pressable onPress={onHeaderPress}>
                <Animated.View style={[styles.container, headerStyle]}>
                    <Text>{service.id}</Text>
                    <Animated.View style={iconStyle}>
                        <Icon name={'chevron-forward-outline'} size={20} />
                    </Animated.View>
                </Animated.View>
            </Pressable>

            <Animated.View style={[styles.items, listStyle]}>
                <View ref={aref} collapsable={false}>
                    {characterstics.map((item, index) => (
                        <AccordionItem
                            key={item.id}
                            characteristic={item}
                            onPress={() => {}}
                            isLast={index === characterstics.length - 1}
                        />
                    ))}
                </View>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        backgroundColor: 'gray',
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
