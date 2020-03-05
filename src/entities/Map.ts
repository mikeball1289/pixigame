import { Entity } from './Entity';
import { MapGeometry } from './attributes/MapGeometry';
import { MapTag } from './tags/MapTag';
import { Root } from '../game/Root';
import { MapGraphicsTag } from './tags/MapGraphicsTag';

export class Map extends Entity {

    constructor(root: Root, geometry: MapGeometry) {
        super(root);

        this.tags = [
            new MapTag(geometry),
            new MapGraphicsTag(geometry),
        ];
    }
}