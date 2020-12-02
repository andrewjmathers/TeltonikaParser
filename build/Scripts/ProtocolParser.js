"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.avlidDictionary = exports.isFMSorPhysical = exports.isPhysical = exports.isIOelement = exports.isFMSid = exports.getNonFMSorPhysical = exports.getElementsWithoutFMS = exports.getDigitalOutputsId = exports.getDigitalInputsId = exports.getAnalogInputsId = exports.castAVLIDtoAVLName = exports.getFMSelements = exports.getAnalogInputs = exports.getDigitalOutputs = exports.getDigitalInputs = exports.parseIMEI = exports.ProtocolParser = void 0;
//import { IProtocolParser } from "../Interfaces/IProtocolParser";
//import { IData } from "../Interfaces/IData";
const PacketReader_1 = require("../Scripts/PacketReader");
const Data_1 = require("./AVL Data Parser/Data");
const IOelement_1 = require("./AVL Data Parser/IOelement");
Object.defineProperty(exports, "getDigitalInputs", { enumerable: true, get: function () { return IOelement_1.getDigitalInputs; } });
Object.defineProperty(exports, "getDigitalOutputs", { enumerable: true, get: function () { return IOelement_1.getDigitalOutputs; } });
Object.defineProperty(exports, "getAnalogInputs", { enumerable: true, get: function () { return IOelement_1.getAnalogInputs; } });
Object.defineProperty(exports, "getFMSelements", { enumerable: true, get: function () { return IOelement_1.getFMSelements; } });
Object.defineProperty(exports, "castAVLIDtoAVLName", { enumerable: true, get: function () { return IOelement_1.castAVLIDtoAVLName; } });
Object.defineProperty(exports, "getAnalogInputsId", { enumerable: true, get: function () { return IOelement_1.getAnalogInputsId; } });
Object.defineProperty(exports, "getDigitalInputsId", { enumerable: true, get: function () { return IOelement_1.getDigitalInputsId; } });
Object.defineProperty(exports, "getDigitalOutputsId", { enumerable: true, get: function () { return IOelement_1.getDigitalOutputsId; } });
Object.defineProperty(exports, "getElementsWithoutFMS", { enumerable: true, get: function () { return IOelement_1.getElementsWithoutFMS; } });
Object.defineProperty(exports, "getNonFMSorPhysical", { enumerable: true, get: function () { return IOelement_1.getNonFMSorPhysical; } });
Object.defineProperty(exports, "isFMSid", { enumerable: true, get: function () { return IOelement_1.isFMSid; } });
Object.defineProperty(exports, "isIOelement", { enumerable: true, get: function () { return IOelement_1.isIOelement; } });
Object.defineProperty(exports, "isFMSorPhysical", { enumerable: true, get: function () { return IOelement_1.isFMSorPhysical; } });
Object.defineProperty(exports, "avlidDictionary", { enumerable: true, get: function () { return IOelement_1.avlidDictionary; } });
Object.defineProperty(exports, "isPhysical", { enumerable: true, get: function () { return IOelement_1.isPhysical; } });
//import { IGPRSparser } from "../Interfaces/IGPRSparser";
const GPRSparser_1 = require("./GPRS Parser/GPRSparser");
const CalcCRC16 = require('./CRC16.js').CalcCRC16;
class ProtocolParser {
    constructor(packet, basic_read, on_ioElement_error) {
        var pr = new PacketReader_1.PacketReader(packet, 2, (x) => {
            var y = parseInt(x, 16);
            if (y > Number.MAX_SAFE_INTEGER) {
                y = BigInt(`0x${x}`);
                y = y.toString();
            }
            return y;
        });
        this.Packet = packet;
        this.Preamble = pr.read(4);
        this.Data_Length = pr.read(4);
        this.CodecID = pr.read(1);
        this.Quantity1 = pr.read(1);
        this.CRC = pr.readEnd(4);
        this.Quantity2 = pr.readEnd(1);
        if (this.Quantity1 != this.Quantity2)
            throw new Error(`Item quantity did not match.`);
        var crc_reader = new PacketReader_1.PacketReader(packet, 2, (x) => parseInt(x, 16));
        crc_reader.read(8);
        crc_reader.readEnd(4);
        var expected_crc = CalcCRC16(crc_reader.remainingContent());
        if (expected_crc != this.CRC)
            throw new Error(`Found CRC (${this.CRC}) wasn't the correct one (${expected_crc}).`);
        let content = null;
        if ([0x08, 0x8E, 0x10].includes(this.CodecID)) {
            this.CodecType = "data sending";
            if (!basic_read)
                content = new Data_1.Data(pr, on_ioElement_error, this.CodecID, this.Quantity1);
        }
        else if ([0x0C, 0x0D, 0x0E].includes(this.CodecID)) {
            this.CodecType = "GPRS messages";
            if (!basic_read)
                content = new GPRSparser_1.GPRS(pr);
        }
        else {
            throw new Error(`Codec ${this.CodecID} not supported.`);
        }
        this.Content = content;
    }
}
exports.ProtocolParser = ProtocolParser;
function parseIMEI(imei) {
    var decodedIMEI = "";
    for (var i = imei.length - 1; i > 3; i -= 2)
        decodedIMEI = imei.charAt(i) + decodedIMEI;
    return decodedIMEI;
}
exports.parseIMEI = parseIMEI;
