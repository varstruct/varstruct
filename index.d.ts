declare module 'varstruct' {
    import { Buffer as NodeBuffer } from 'buffer';

    // https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings
    export type Encoding =
        | 'ascii'
        | 'utf8'
        | 'utf16le'
        | 'ucs2'
        | 'base64'
        | 'latin1'
        | 'binary'
        | 'hex';

    export interface Codec {
        encode (object: any, buffer?: NodeBuffer, offset?: number): NodeBuffer;
        decode (buffer: NodeBuffer, offset?: number): NodeBuffer;
        encodingLength (object: any): number;
    }

    export interface ItemStruct {
        name: string;
        type: Codec;
    }

    export type ItemTuple = [string, Codec];

    export type Item = ItemStruct | ItemTuple;

    export default function (items: Item[]): Codec;

    export const Byte: Codec;
    export const Int8: Codec;
    export const UInt8: Codec;
    export const Int16BE: Codec;
    export const Int16LE: Codec;
    export const UInt16BE: Codec;
    export const UInt16LE: Codec;
    export const Int32BE: Codec;
    export const Int32LE: Codec;
    export const UInt32BE: Codec;
    export const UInt32LE: Codec;
    export const Int64BE: Codec;
    export const Int64LE: Codec;
    export const UInt64BE: Codec;
    export const UInt64LE: Codec;
    export const FloatBE: Codec;
    export const FloatLE: Codec;
    export const DoubleBE: Codec;
    export const DoubleLE: Codec;

    export function Array (length: number, itemCodec: Codec): Codec;
    export function VarArray (lengthCodec: Codec, itemCodec: Codec): Codec;
    export function Sequence (itemCodecs: Codec[]): Codec;
    export function Buffer (length: number): Codec;
    export function VarBuffer (lengthCodec: Codec): Codec;
    export function VarMap (lengthCodec: Codec, keyCodec: Codec, valueCodec: Codec): Codec;
    export function String (length: number, encoding?: Encoding): Codec;
    export function VarString (lengthCodec: Codec, encoding?: Encoding): Codec;
    export function Bound (itemCodec: Codec, checkValue: () => any): Codec;
    export function Value (itemCodec: Codec, value: any): Codec;
}
