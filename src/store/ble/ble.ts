import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '@src/store';
import { Device } from 'react-native-ble-plx';

export type ManufacturerData = {
    code: string;
    data: string;
    name: string | null;
};

export type BleDevice = {
    lastUpdated: number;
    manufacturerData: ManufacturerData;
} & Device;

export interface BleState {
    isScanning: boolean;
    connectedDevice: Device | null;
}

const bleAdapter = createEntityAdapter<BleDevice>({
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
        addToDiscoveredDevices: (state, action: PayloadAction<BleDevice>) => {
            const device = {
                ...action.payload,
                lastUpdated: Date.now(),
                manufacturerData: action.payload.manufacturerData,
            };
            bleAdapter.addOne(state, device);
        },
        updateRssiForDevice: (
            state,
            action: PayloadAction<{ id: string; rssi: number | null }>
        ) => {
            const { id, rssi } = action.payload;
            const lastUpdated = Date.now();
            bleAdapter.updateOne(state, { id, changes: { rssi, lastUpdated } });
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
