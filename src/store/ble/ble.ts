import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '@src/store';
import { Device } from 'react-native-ble-plx';

export interface BleState {
    isScanning: boolean;
    connectedDevice: Device | null;
}

const bleAdapter = createEntityAdapter<Device>({
    selectId: device => device.id,
});

const initialState = bleAdapter.getInitialState({
    isScanning: false,
    connectedDevice: null,
});

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
        addToDiscoveredDevices: (state, action: PayloadAction<Device>) => {
            bleAdapter.addOne(state, action.payload);
        },
        updateRssiForDevice: (
            state,
            action: PayloadAction<{ id: string; rssi: number | null }>
        ) => {
            const { id, rssi } = action.payload;
            bleAdapter.updateOne(state, { id, changes: { rssi } });
        },
        clearDiscoveredDevices: state => {
            bleAdapter.removeAll(state);
        },
    },
});

// Actions
export const bleActions = { ...bleSlice.actions };

// Selectors
const selectBleState = (state: AppState): BleState => state.ble;
const entitySelectors = bleAdapter.getSelectors<AppState>(state => state.ble);

const selectIsScanning = createSelector([selectBleState], state => {
    return state.isScanning;
});

export const bleSelectors = {
    ...entitySelectors,
    selectIsScanning,
};

export default bleSlice.reducer;
