import { Tag } from '../Entity';
import { MapGeometry } from '../attributes/MapGeometry';

export class MapGraphicsTag implements Tag {
    public static TYPE = Symbol('MapGraphics');

    public readonly type = MapGraphicsTag.TYPE;

    public mapGraphic: PIXI.Container;

    constructor(geometry: MapGeometry) {
        this.mapGraphic = new PIXI.Container();
        for (let y = 0; y < geometry.tiles.height; y ++) {
            for (let x = 0; x < geometry.tiles.width; x ++) {
                if (geometry.tiles.get(x, y) !== 0) {
                    let graphic = new PIXI.Graphics();
                    graphic.beginFill(0);
                    graphic.drawRect(0, 0, geometry.tileSize, geometry.tileSize);
                    graphic.x = x * geometry.tileSize;
                    graphic.y = y * geometry.tileSize;
                    this.mapGraphic.addChild(graphic);
                }
            }
        }
    }
}