import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '@src/store';

export type BleState = {
    isScanning: boolean;
    scanningStartedAt: number | null;
    scanningTimeout: number | null;
    connectedDeviceId: string | null;
};

const initialState: BleState = {
    isScanning: false,
    scanningStartedAt: null,
    scanningTimeout: null,
    connectedDeviceId: null,
};

export const bleSlice = createSlice({
    name: 'ble',
    initialState,
    reducers: {
        startScan: state => {
            state.isScanning = true;
            state.scanningStartedAt = Date.now();
        },
        stopScan: state => {
            state.isScanning = false;
            state.scanningStartedAt = null;
        },
        setScanningTimeout: (state, action: PayloadAction<number | null>) => {
            state.scanningTimeout = action.payload;
        },
        selectConnectedDeviceId: (state, action: PayloadAction<string | null>) => {
            state.connectedDeviceId = action.payload;
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

const selectConnectedDeviceId = createSelector([selectBleState], state => {
    return state.connectedDeviceId;
});

export const bleSelectors = {
    selectIsScanning,
    selectConnectedDeviceId,
};

export default bleSlice.reducer;
