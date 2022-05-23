import { createEntityAdapter, createSlice, PayloadAction, Update } from '@reduxjs/toolkit';
import { AppState } from '@src/store';
import { Device } from 'react-native-ble-plx';
import { BleDevice, DevicesState, Manufacturer } from './types';

type RssiUpdatePayload = {
    id: string;
    rssi: number;
};

type ManufacturerUpdatePayload = {
    id: string;
    manufacturer: Manufacturer;
};

const devicesAdapter = createEntityAdapter<BleDevice>({
    selectId: device => device.id,
});

const initialState = devicesAdapter.getInitialState();

export const devicesSlice = createSlice({
    name: 'devices',
    initialState,
    reducers: {
        addToDiscovered: (state, action: PayloadAction<Device>) => {
            const manufacturer: Manufacturer = {
                code: null,
                data: null,
                name: action.payload.manufacturerData,
            };
            const device = {
                ...action.payload,
                updatedAt: Date.now(),
                rssiHistory: [],
                manufacturer,
            };
            devicesAdapter.addOne(state, device as BleDevice);
        },
        updateRssi: (state, action: PayloadAction<RssiUpdatePayload>) => {
            const { id, rssi } = action.payload;

            const device = internalSelectors.selectById(state, id);
            if (!rssi || !device) return;
            const updatedAt = Date.now();
            const newRssiPoint = {
                rssi,
                timestamp: updatedAt,
            };
            devicesAdapter.updateOne(state, {
                id,
                changes: {
                    rssi,
                    updatedAt,
                    rssiHistory: [...device.rssiHistory, newRssiPoint],
                },
            } as Update<BleDevice>);
        },
        updateManufacturerData: (state, action: PayloadAction<ManufacturerUpdatePayload>) => {
            const { id, manufacturer } = action.payload;

            devicesAdapter.updateOne(state, {
                id,
                changes: {
                    updatedAt: Date.now(),
                    manufacturer,
                },
            } as Update<BleDevice>);
        },
        clearDiscovered: state => {
            devicesAdapter.removeAll(state);
        },
    },
});

// Actions
export const devicesActions = { ...devicesSlice.actions };

// Selectors
const selectDevicesState = (state: AppState): DevicesState => state.devices;

const entitySelectors = devicesAdapter.getSelectors(selectDevicesState);

const internalSelectors = {
    ...devicesAdapter.getSelectors(),
};

export const devicesSelectors = {
    ...entitySelectors,
};

export default devicesSlice.reducer;
