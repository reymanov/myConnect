import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
    interpolate,
} from 'react-native-reanimated';

interface IRingProps {
    size: number;
    color: string;
    delay: number;
}

const Ring: React.FC<IRingProps> = ({ size, color, delay }) => {
    const ring = useSharedValue(0);

    const ringStyle = useAnimatedStyle(() => {
        return {
            opacity: 0.8 - ring.value,
            transform: [
                {
                    scale: interpolate(ring.value, [0, 1], [0, 4]),
                },
            ],
        };
    });

    useEffect(() => {
        ring.value = withDelay(
            delay,
            withRepeat(
                withTiming(1, {
                    duration: 2500,
                }),
                -1,
                false
            )
        );
    }, []);
    return (
        <Animated.View
            style={[
                styles.ring,
                { backgroundColor: color, width: size, height: size, borderRadius: size },
                ringStyle,
            ]}
        />
    );
};

interface IPulseProps {
    size: number;
    color: string;
    style?: ViewStyle;
}

export const Pulse: React.FC<IPulseProps> = ({ size, color, style }) => {
    return (
        <View style={[styles.wrapper, style]}>
            <Ring size={size} color={color} delay={0} />
            <Ring size={size} color={color} delay={500} />
            <Ring size={size} color={color} delay={1000} />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    ring: {
        position: 'absolute',
    },
});
