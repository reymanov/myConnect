import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface IAnimatedDots {
    color?: string;
}

const configOn = {
    toValue: 1,
    delay: 100,
    duration: 200,
    useNativeDriver: true,
};

const configOff = {
    toValue: 0,
    duration: 200,
    delay: 200,
    useNativeDriver: true,
};

export const AnimatedDots: React.FC<IAnimatedDots> = ({ color = '#000' }) => {
    const animatedOpacity1 = useRef(new Animated.Value(0)).current;
    const animatedOpacity2 = useRef(new Animated.Value(0)).current;
    const animatedOpacity3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedOpacity1, configOn),
                Animated.timing(animatedOpacity2, configOn),
                Animated.timing(animatedOpacity3, configOn),
                Animated.parallel([
                    Animated.timing(animatedOpacity1, configOff),
                    Animated.timing(animatedOpacity2, configOff),
                    Animated.timing(animatedOpacity3, configOff),
                ]),
            ])
        ).start();
    }, [animatedOpacity1, animatedOpacity2, animatedOpacity3]);

    return (
        <View style={styles.wrapper}>
            <Animated.View
                style={[{ opacity: animatedOpacity1, backgroundColor: color }, styles.dot]}
            />
            <Animated.View
                style={[{ opacity: animatedOpacity2, backgroundColor: color }, styles.dot]}
            />
            <Animated.View
                style={[{ opacity: animatedOpacity3, backgroundColor: color }, styles.dot]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    dot: {
        width: 2,
        height: 2,
        borderRadius: 10,
        marginHorizontal: 1.5,
    },
});
