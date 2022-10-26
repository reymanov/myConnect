import { Buffer } from 'buffer';
import { Manufacturer } from '@store/devices';
import { MANUFACTURERS } from '@constants/manufacturers';

export const decodeManufacturerData = (data: string | null): Manufacturer | null => {
    if (!data) return null;
    const buffer = Buffer.from(data, 'base64').toString('hex').toUpperCase();
    const manufacturerCode = '0x' + buffer.substring(0, 4).match(/.{2}/g)?.reverse().join('');
    const manufacturerData = '0x' + buffer.substring(4).match(/.{2}/g)?.join('-');
    const manufacturerName = MANUFACTURERS.find(m => m.id === manufacturerCode)?.name;

    return {
        code: manufacturerCode,
        name: manufacturerName || null,
        data: manufacturerData,
    };
};
