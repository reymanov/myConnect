import AsyncStorage from '@react-native-community/async-storage';
import { ColorSchemeName } from 'react-native';

export const setColorScheme = async (colorScheme: ColorSchemeName) => {
    try {
        await AsyncStorage.setItem('@color-mode', colorScheme as string);
    } catch (error) {
        console.error(error);
    }
};

export const getColorScheme = async (): Promise<ColorSchemeName | null> => {
    try {
        const colorScheme = await AsyncStorage.getItem('@color-mode');
        return colorScheme as ColorSchemeName;
    } catch (error) {
        console.error(error);
    }
};
