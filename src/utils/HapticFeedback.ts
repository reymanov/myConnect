import ReactNativeHapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';

const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

export const triggerHapticFeedback = (type: HapticFeedbackTypes) =>
    ReactNativeHapticFeedback.trigger(type, options);
