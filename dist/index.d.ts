interface Decode<D> {
    readonly forceDecode: (data: unknown) => D;
}
export interface Decoder<D> {
    readonly forceDecode: Decode<D>['forceDecode'];
    readonly decode: (data: unknown) => ReturnType<Decode<D>['forceDecode']> | null;
    readonly validate: (data: unknown) => ValidationResult<D>;
    readonly is: (data: unknown) => data is D;
    readonly andThen: <T>(transformer: (data: D) => T) => Decoder<T>;
}
export declare type ValidationResult<D> = {
    type: 'ok';
    data: D;
} | {
    type: 'error';
    error: DecoderError;
};
export declare type Output<T extends Decoder<any>> = ReturnType<T['forceDecode']>;
export declare const createDecoder: <D>(decoder: Decode<D>) => Decoder<D>;
export declare class DecoderError extends SyntaxError {
    path: string[];
    constructor(message?: string, path?: string[]);
}
/**
 * Throws if data is null or undefined
 */
export declare const checkDefined: (data: unknown) => data is null | undefined;
/**
 * If the data is null return null
 * else, pass to the decoder where 'checkDefined'
 * fails only when data is undefined
 */
export declare const nullable: <D>(decoder: Decoder<D>) => Decoder<D | null>;
export declare const unknown: Decoder<unknown>;
export declare const string: Decoder<string>;
export declare const number: Decoder<number>;
export declare const boolean: Decoder<boolean>;
export declare const literal: <D extends string | number | boolean>(literal: D) => Decoder<D>;
export declare const oneOf: <D extends readonly any[]>(...decoders: { [K in keyof D]: Decoder<D[K]>; }) => Decoder<D[number]>;
export declare const literalUnion: <D extends readonly (string | number | boolean)[]>(...decoders: D) => Decoder<D[number]>;
export declare const regex: (regex: RegExp) => Decoder<string>;
export declare const array: <D>(decoder: Decoder<D>) => Decoder<D[]>;
export declare const iterable: <D>(decoder: Decoder<D>) => Decoder<D[]>;
export declare const tuple: <D extends readonly unknown[]>(...decoders: { [K in keyof D]: Decoder<D[K]>; }) => Decoder<D>;
export declare const record: <D>(decoder: Decoder<D>) => Decoder<Record<string, D>>;
export declare const keyValuePairs: <D>(decoder: Decoder<D>) => Decoder<[string, D][]>;
export declare type DecoderRecord = Record<PropertyKey, Decoder<any>>;
declare type OmitEmptyPartial<T extends DecoderRecord> = T extends infer U & Partial<{
    [x: string]: any;
}> ? U : never;
declare type ObjectType<D extends DecoderRecord> = D extends {
    [K in keyof infer U]: Decoder<(infer U)[K]>;
} ? U : never;
declare const required: <D extends DecoderRecord>(struct: D) => Decoder<ObjectType<D>>;
export declare const object: <D extends DecoderRecord, E extends DecoderRecord>(struct: {
    required?: D | undefined;
    optional?: E | undefined;
}) => Decoder<OmitEmptyPartial<ObjectType<D> & Partial<ObjectType<E>>>>;
export declare const recursive: <D>(decoder: () => Decoder<D>) => Decoder<D>;
export {};
