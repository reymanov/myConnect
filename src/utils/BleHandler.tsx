import React, { useEffect, useRef } from 'react';
import { BleManager, Device, ScanMode } from 'react-native-ble-plx';
import { useSelectDiscoveredDevices, useSelectIsScanning } from '@src/store/ble/useBleSelectors';
import { useDispatch } from 'react-redux';
import { bleActions } from '@src/store/ble';
import _ from 'lodash';

// const toBleDevice = (device: Device) => ({
//     id: device.id,
//     name: device.name,
//     rssi: device.rssi,
//     manufacturerData: device.manufacturerData,
//     isConnectable: device.isConnectable,
// });

// const manager = new BleManager();

const BleHandler: React.FC = () => {
    // const isScanning = useSelectIsScanning();
    // const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    // const dispatch = useDispatch();

    return null;
};

export default BleHandler;
