export interface IDunGenConfig {
    width: number;
    height: number;
    roomAttempts?: number;
    roomSize?: number;
    turnRate?: number;
    roomSizeRange?: number;
    extraConnectionRate?: number;
    maxSectionConnections?: number;
    seed?: number;
}
export declare const opts: IDunGenConfig;
export declare class Map2d<V> {
    width: number;
    height: number;
    changeLog: [number, number, V][];
    data: V[];
    constructor(width: number, height: number, initializer: V | ((x: number, y: number) => V));
    get(x: number, y: number): V;
    set(x: number, y: number, val: V): V;
    toString(strfn?: (d: V) => string): string;
}
export declare function DunGen(config: IDunGenConfig, seed?: number): {
    map: Map2d<number>;
    rooms: {
        x: number;
        y: number;
        width: number;
        height: number;
    }[];
    seed: number;
};
export declare type DunGenPack = ReturnType<typeof DunGen>;
