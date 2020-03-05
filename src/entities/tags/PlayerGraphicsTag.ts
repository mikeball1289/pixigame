import { Tag } from '../Entity';

export class EntityGraphicsTag implements Tag {
    public static TYPE = Symbol('EntityGraphics');

    public readonly type = EntityGraphicsTag.TYPE;

    constructor(public graphics: PIXI.Container) { }
}