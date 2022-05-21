import { EntityState } from '@reduxjs/toolkit';
import { Device } from 'react-native-ble-plx';

export interface Manufacturer {
    code: string | null;
    data: string | null;
    name: string | null;
}

export type RssiPoint = {
    rssi: number;
    timestamp: number;
};

export type BleDevice = {
    updatedAt: number;
    manufacturer: Manufacturer;
    rssiHistory: RssiPoint[] | [];
} & Device;

export type DevicesState = EntityState<BleDevice>;
