import { useRef, useState } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';

interface BluetoothLowEnergyAPI {
    allDevices: Device[];
    connectedDevice: Device | null;
    scanForPeripherals(): void;
    stopScan(): void;
    clearDevices(): void;
    connectToDevice: (device: Device) => Promise<void>;
    disconnectFromDevice: () => void;
}

const bleManager = new BleManager();
const SCAN_INTERVAL = 2000;

const useBle = (): BluetoothLowEnergyAPI => {
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const scanInterval = useRef<NodeJS.Timeout | null>(null);

    const isAlreadyDiscovered = (devices: Device[], nextDevice: Device) =>
        devices.findIndex(device => nextDevice.id === device.id) > -1;

    const scanForPeripherals = () => {
        scanInterval.current = setInterval(() => {
            bleManager.startDeviceScan(null, null, async (error, device) => {
                if (!device || !device.name) return;

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
        if (scanInterval.current) clearInterval(scanInterval.current);
        bleManager.stopDeviceScan();
    };

    const clearDevices = () => {
        setAllDevices([]);
    };

    const connectToDevice = async (device: Device) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();
        } catch (e) {
            console.error('Failed to connect to device', e);
        }
    };

    const disconnectFromDevice = () => {
        if (connectedDevice) {
            bleManager.cancelDeviceConnection(connectedDevice.id);
            setConnectedDevice(null);
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
    };
};

export default useBle;
