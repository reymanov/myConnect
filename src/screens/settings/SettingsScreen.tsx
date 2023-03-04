import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, Switch, Text, useColorMode } from 'native-base';

import packageJSON from '@root/package.json';
import ThemedContainer from '@containers/ThemedContainer';
import { GenericList, GenericListItem } from '@components/lists';

export const SettingsScreen: React.FC = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { version, build } = packageJSON;

    const aboutItems: GenericListItem[] = [
        {
            icon: 'options',
            title: 'Application Version',
            element: <Text fontSize={16}>{version}</Text>,
        },
        {
            icon: 'hammer',
            title: 'Build Number',
            element: <Text fontSize={16}>{build}</Text>,
        },
    ];

    const generalItems: GenericListItem[] = [
        {
            icon: 'moon',
            title: 'Dark Mode',
            element: <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} />,
        },
    ];

    const helpItems: GenericListItem[] = [
        {
            icon: 'chatbox-ellipses',
            title: 'Contact Us',
            isTouchable: true,
            onPress: () => {},
        },
        {
            icon: 'document-text',
            title: 'Terms of Service',
            isTouchable: true,
            onPress: () => {},
        },
    ];

    return (
        <ThemedContainer style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <GenericList label="General" items={generalItems} />
                <GenericList label="About" items={aboutItems} />
                <GenericList label="Other" items={helpItems} />
            </ScrollView>

            <Text style={styles.copyright}>Copyright © 2023 Jakub Rejmann</Text>
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
        paddingTop: 24,
    },
    copyright: {
        position: 'absolute',
        bottom: 16,
        fontSize: 12,
        alignSelf: 'center',
        color: 'gray',
        zIndex: -1,
    },
});
