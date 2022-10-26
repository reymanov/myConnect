import { useSelector } from 'react-redux';
import { AppState } from '@src/store';
import { bleSelectors } from './ble';

export const useSelectIsScanning = () => {
    return useSelector((state: AppState) => bleSelectors.selectIsScanning(state));
};
