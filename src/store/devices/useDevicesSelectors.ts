import { AppState } from '@src/store';
import { useSelector } from 'react-redux';
import { devicesSelectors } from './devices';

export const useSelectDiscoveredDevices = () => {
    return useSelector((state: AppState) => devicesSelectors.selectAll(state));
};

export const useSelectDiscoveredDeviceIds = () => {
    return useSelector((state: AppState) => devicesSelectors.selectIds(state));
};

export const useSelectDeviceById = (id: string) => {
    return useSelector((state: AppState) => devicesSelectors.selectById(state, id));
};
