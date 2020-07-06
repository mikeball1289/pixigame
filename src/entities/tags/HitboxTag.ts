import { Tag, TagType } from '../Entity';
import { SwingCollider } from '../attributes/Collider';

export class HitboxTag implements Tag {
    public static TYPE = Symbol('Hitbox');

    public readonly type = HitboxTag.TYPE;

    constructor(public collider: SwingCollider, public hitIdentities: TagType<Tag>[] = []) { }
}