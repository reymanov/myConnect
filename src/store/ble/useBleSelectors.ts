import { useSelector } from 'react-redux';
import { AppState } from '@src/store';
import { bleSelectors } from './ble';

export const useSelectIsScanning = () => {
    return useSelector((state: AppState) => bleSelectors.selectIsScanning(state));
};

export const useSelectConnectedDeviceId = () => {
    return useSelector((state: AppState) => bleSelectors.selectConnectedDeviceId(state));
};

export const useSelectIsDeviceConnected = (id: string) => {
    const connectedDeviceId = useSelectConnectedDeviceId();
    return connectedDeviceId === id;
};
