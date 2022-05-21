import { createSelector, createSlice } from '@reduxjs/toolkit';
import { AppState } from '@src/store';
import { Device } from 'react-native-ble-plx';

export type BleState = {
    isScanning: boolean;
    connectedDevice: Device | null;
};

const initialState = {
    isScanning: false,
    connectedDevice: null,
};

export const bleSlice = createSlice({
    name: 'ble',
    initialState,
    reducers: {
        startScan: state => {
            state.isScanning = true;
        },
        stopScan: state => {
            state.isScanning = false;
        },
    },
});

// Actions
export const bleActions = { ...bleSlice.actions };

// Selectors
const selectBleState = (state: AppState): BleState => state.ble;

const selectIsScanning = createSelector([selectBleState], state => {
    return state.isScanning;
});

const selectConnectedDevice = createSelector([selectBleState], state => {
    return state.connectedDevice;
});

export const bleSelectors = {
    selectIsScanning,
    selectConnectedDevice,
};

export default bleSlice.reducer;
