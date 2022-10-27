import { bleActions } from '@store/ble';
import { useRef, useState } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { useDispatch } from 'react-redux';

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
        console.log('before', scanInterval.current);
        if (scanInterval.current) {
            clearInterval(scanInterval.current);
            scanInterval.current = null;
        }
        console.log('after', scanInterval.current);
        bleManager.stopDeviceScan();
    };

    const clearDevices = () => {
        setAllDevices([]);
        console.log(scanInterval.current);
    };

    const connectToDevice = async (device: Device) => {
        try {
            await bleManager.connectToDevice(device.id);
            setConnectedDevice(device);
            await device.discoverAllServicesAndCharacteristics();
            const services = await device.services();
            const characteristics = await device.characteristicsForService(services[0].uuid);
            // console.log('Characteristics', characteristics);
            bleManager.stopDeviceScan();
            dispatch(bleActions.stopScan());
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

    const readFromDevice = async (device: Device) => {
        if (!device) return;
        device.monitorCharacteristicForService('', '', () => {});
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

// 1. Connect to device
// 2. Discover all services and characteristics
// 3. Get services
// 4. Get characteristics for service

// [
//     {
//         _manager: {
//             _activePromises: [Object],
//             _activeSubscriptions: [Object],
//             _errorCodesToMessagesMapping: [Object],
//             _eventEmitter: [NativeEventEmitter],
//             _scanEventSubscription: [Object],
//             _uniqueId: 4,
//         },
//         deviceID: 'E3775F09-4DBC-DBA3-3089-3A321846B553',
//         id: 10784944384,
//         isPrimary: true,
//         uuid: 'd0611e78-bbb4-4591-a5f8-487910ae4366',
//     },
//     {
//         _manager: {
//             _activePromises: [Object],
//             _activeSubscriptions: [Object],
//             _errorCodesToMessagesMapping: [Object],
//             _eventEmitter: [NativeEventEmitter],
//             _scanEventSubscription: [Object],
//             _uniqueId: 4,
//         },
//         deviceID: 'E3775F09-4DBC-DBA3-3089-3A321846B553',
//         id: 10784936256,
//         isPrimary: true,
//         uuid: '9fa480e0-4967-4542-9390-d343dc5d04ae',
//     },
//     {
//         _manager: {
//             _activePromises: [Object],
//             _activeSubscriptions: [Object],
//             _errorCodesToMessagesMapping: [Object],
//             _eventEmitter: [NativeEventEmitter],
//             _scanEventSubscription: [Object],
//             _uniqueId: 4,
//         },
//         deviceID: 'E3775F09-4DBC-DBA3-3089-3A321846B553',
//         id: 10784960768,
//         isPrimary: true,
//         uuid: '0000180a-0000-1000-8000-00805f9b34fb',
//     },
// ];

// [
//     {
//         _manager: {
//             _activePromises: [Object],
//             _activeSubscriptions: [Object],
//             _errorCodesToMessagesMapping: [Object],
//             _eventEmitter: [NativeEventEmitter],
//             _scanEventSubscription: [Object],
//             _uniqueId: 5,
//         },
//         deviceID: 'E3775F09-4DBC-DBA3-3089-3A321846B553',
//         id: 10769212704,
//         isIndicatable: false,
//         isNotifiable: true,
//         isNotifying: false,
//         isReadable: false,
//         isWritableWithResponse: true,
//         isWritableWithoutResponse: false,
//         serviceID: 10786857728,
//         serviceUUID: 'd0611e78-bbb4-4591-a5f8-487910ae4366',
//         uuid: '8667556c-9a37-4c91-84ed-54ee27d90049',
//         value: null,
//     },
// ];
