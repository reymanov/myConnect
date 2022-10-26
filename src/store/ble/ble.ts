import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '@src/store';

export type BleState = {
    isScanning: boolean;
};

const initialState: BleState = {
    isScanning: false,
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

export const bleSelectors = {
    selectIsScanning,
};

export default bleSlice.reducer;
