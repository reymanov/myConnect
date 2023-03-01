import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BleManager, Characteristic, Device, Service } from 'react-native-ble-plx';

import { bleActions } from '@store/ble';
import { Alert } from 'react-native';

interface BluetoothLowEnergyAPI {
    allDevices: Device[];
    connectedDevice: Device | null;
    scanForPeripherals(): void;
    stopScan(): void;
    clearDevices(): void;
    connectToDevice: (device: Device) => Promise<void>;
    disconnectFromDevice: () => void;
    discoverAllServicesAndCharacteristics: (
        device: Device
    ) => Promise<{ services: Service[]; characteristics: Characteristic[] } | undefined>;
}

const bleManager = new BleManager();
const SCAN_INTERVAL = 2000;

const useBle = (): BluetoothLowEnergyAPI => {
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const scanInterval = useRef<NodeJS.Timeout | null>(null);
    const dispatch = useDispatch();

    const isAlreadyDiscovered = (devices: Device[], nextDevice: Device) =>
        devices.findIndex(device => nextDevice.id === device.id) > -1;

    const scanForPeripherals = () => {
        scanInterval.current = setInterval(() => {
            bleManager.startDeviceScan(null, null, async (error, device) => {
                if (!device || (!device.name && !device.manufacturerData)) return;

                setAllDevices((prevState: Device[]) => {
                    if (isAlreadyDiscovered(prevState, device)) {
                        const tempState = [...prevState];
                        const index = tempState.findIndex(d => d.id === device.id);
                        tempState[index] = device;
                        return tempState;
                    } else {
                        return [...prevState, device];
                    }
                });

                if (error) console.log(error);
            });
        }, SCAN_INTERVAL);
    };

    const stopScan = () => {
        if (scanInterval.current) {
            clearInterval(scanInterval.current);
            scanInterval.current = null;
        }
        bleManager.stopDeviceScan();
        dispatch(bleActions.stopScan());
    };

    const clearDevices = () => {
        setAllDevices([]);
    };

    const connectToDevice = async (device: Device) => {
        try {
            await bleManager.connectToDevice(device.id, { timeout: 5000 });
            setConnectedDevice(device);
            bleManager.stopDeviceScan();
            dispatch(bleActions.stopScan());
        } catch (e) {
            throw e;
        }
    };

    const disconnectFromDevice = () => {
        if (connectedDevice) {
            bleManager.cancelDeviceConnection(connectedDevice.id);
            setConnectedDevice(null);
        }
    };

    const discoverAllServicesAndCharacteristics = async (device: Device) => {
        try {
            await device.discoverAllServicesAndCharacteristics();
            const services = await device.services();
            const characteristics = await Promise.all(
                services.map(async service => {
                    const chars = await service.characteristics();
                    return chars;
                })
            );

            return {
                services,
                characteristics: characteristics.flat(),
            };
        } catch (e) {
            console.error('Failed to discover services and characteristics', e);
        }
    };

    return {
        allDevices,
        connectedDevice,
        scanForPeripherals,
        stopScan,
        clearDevices,
        connectToDevice,
        disconnectFromDevice,
        discoverAllServicesAndCharacteristics,
    };
};

export default useBle;

// 1. Connect to device
// 2. Discover all services and characteristics
// 3. Get services
// 4. Get characteristics for service
