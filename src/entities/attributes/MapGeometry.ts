import { Map2d } from '../../../Dungen';

export class MapGeometry {
    constructor(public tiles: Map2d<number>, public tileSize: number) { }
}