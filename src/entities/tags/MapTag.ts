import { Tag } from '../Entity';
import { MapGeometry } from '../attributes/MapGeometry';

export class MapTag implements Tag {
    public static TYPE = Symbol('Map');

    public readonly type = MapTag.TYPE;

    constructor(public geometry: MapGeometry) { }
}