import { CircleCollider } from "../attributes/Collider";
import { Tag } from "../Entity";

export class CollisionTag implements Tag {
    public static TYPE = Symbol('Collision');

    public readonly type = CollisionTag.TYPE;

    constructor(public collider: CircleCollider) { }
}