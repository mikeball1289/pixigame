import { Entity } from "./Entity";
import { CollisionTag } from "./tags/CollisionTag";
import { CircleCollider } from "./attributes/Collider";
import { EnterFrameTag } from "./tags/EnterFrameTag";
import { InertialTag } from "./tags/InertialTag";
import { isKeyDown } from "../game/io";
import { Key } from "../polyfill";
import { Root } from "../game/Root";
import { Point } from "../physics/Point";

export class Player extends Entity {
    public static TYPE = 'player';
    public readonly type = Player.TYPE;

    private collider = CircleCollider(0, 0, 20);
    private velocity = new Point();

    constructor(root: Root) {
        super(root);

        this.tags = [
            new CollisionTag(this.collider),
            new InertialTag(this.collider, this.velocity),
            new EnterFrameTag(() => this.updateImpulse()),
        ];

        root.register(this);
    }

    private updateImpulse() {
        if (isKeyDown(Key.W)) {
            this.velocity.y = -5;
        } else if (isKeyDown(Key.S)) {
            this.velocity.y = 5;
        } else {
            this.velocity.y = 0;
        }

        if (isKeyDown(Key.A)) {
            this.velocity.x = -5;
        } else if (isKeyDown(Key.D)) {
            this.velocity.x = 5;
        } else {
            this.velocity.x = 0;
        }
    }
}