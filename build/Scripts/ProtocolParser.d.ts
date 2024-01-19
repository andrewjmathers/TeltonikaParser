import { AVL_Data as AvlData } from './AVL Data Parser/AVL_Data';
import { Data as _data } from './AVL Data Parser/Data';
import { IOelement, isIOelement, getDigitalInputs, getDigitalOutputs, getAnalogInputs, getFMSelements, castAVLIDtoAVLName, getElementsWithoutFMS, getNonFMSorPhysical, isFMSid, isFMSorPhysical, getOrganizedElements, getBooleanDigitalAnalog } from './AVL Data Parser/IOelement';
import { GPRS as gprs } from './GPRS Parser/GPRSparser';
export declare class ProtocolParser {
    Packet: string;
    Preamble: number;
    Data_Length: number;
    CodecID: number;
    Quantity1: number;
    CodecType: 'data sending' | 'GPRS messages';
    Content: gprs | _data | null;
    Quantity2: number;
    CRC: number;
    constructor(packet: string, basic_read?: boolean, on_ioElement_error?: (e: Error) => void);
}
export declare function parseIMEI(imei: string): string;
export declare const FMB640Utils: {
    AnalogInputsId: number[];
    DigitalInputsId: number[];
    DigitalOutputsId: number[];
    avlidDictionary: Record<number, string>;
    getDigitalInputs: typeof getDigitalInputs;
    getDigitalOutputs: typeof getDigitalOutputs;
    getAnalogInputs: typeof getAnalogInputs;
    getFMSelements: typeof getFMSelements;
    castAVLIDtoAVLName: typeof castAVLIDtoAVLName;
    getElementsWithoutFMS: typeof getElementsWithoutFMS;
    getNonFMSorPhysical: typeof getNonFMSorPhysical;
    isFMSid: typeof isFMSid;
    isPhysical: (id: number) => boolean;
    isFMSorPhysical: typeof isFMSorPhysical;
    getOrganizedElements: typeof getOrganizedElements;
    isAnalogInput: (id: number) => boolean;
    isDigitalInput: (id: number) => boolean;
    isDigitalOutput: (id: number) => boolean;
    getBooleanDigitalAnalog: typeof getBooleanDigitalAnalog;
};
export { isIOelement };
export declare type Data = _data;
export declare type AVL_Data = AvlData;
export { IOelement };
export declare type GPRS = gprs;
