import React from 'react';
import { StyleSheet, View } from 'react-native';
import ThemedContainer from '@containers/ThemedContainer';
import { ScrollView, Switch, Text, useColorMode, useTheme } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

export const SettingsScreen: React.FC = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { colors } = useTheme();

    const backgroundColor = colorMode === 'dark' ? colors.dark[100] : colors.white;
    const color = colorMode === 'dark' ? colors.white : colors.black;
    return (
        <ThemedContainer style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={[styles.item, { backgroundColor }]}>
                    <View style={styles.itemTitle}>
                        <Icon name="moon" size={16} color={color} style={{ marginRight: 8 }} />
                        <Text fontSize={16}>Dark Mode</Text>
                    </View>

                    <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
                </View>
            </ScrollView>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        padding: 8,
    },
    item: {
        minHeight: 50,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 8,
    },
    itemTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    opacity: {
        opacity: 0.5,
    },
});
