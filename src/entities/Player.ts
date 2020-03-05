import { Entity } from './Entity';
import { CollisionTag } from './tags/CollisionTag';
import { CircleCollider } from './attributes/Collider';
import { EnterFrameTag } from './tags/EnterFrameTag';
import { InertialTag } from './tags/InertialTag';
import { isKeyDown } from '../game/io';
import { Key } from '../polyfill';
import { Root } from '../game/Root';
import { Point } from '../physics/Point';
import { EntityGraphicsTag } from './tags/PlayerGraphicsTag';

export class Player extends Entity {
    private collider = CircleCollider(0, 0, 20);
    private velocity = new Point();

    constructor(root: Root) {
        super(root);

        const graphicsContainer = new PIXI.Container();
        const player = new PIXI.Graphics();
        player.beginFill(0xFFFFFF);
        player.drawCircle(0, 0, 20);
        graphicsContainer.addChild(player);

        this.tags = [
            new CollisionTag(this.collider),
            new InertialTag(this.collider, this.velocity),
            new EnterFrameTag(() => this.updateImpulse()),
            new EntityGraphicsTag(graphicsContainer),
        ];
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