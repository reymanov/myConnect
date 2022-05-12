import { useSelector } from 'react-redux';
import { AppState } from '@src/store';
import { bleSelectors } from './ble';

export const useSelectIsScanning = () => {
    return useSelector((state: AppState) => bleSelectors.selectIsScanning(state));
};

export const useSelectDiscoveredDevices = () => {
    return useSelector((state: AppState) => bleSelectors.selectAll(state));
};

export const useSelectDiscoveredDeviceIds = () => {
    return useSelector((state: AppState) => bleSelectors.selectIds(state));
};
