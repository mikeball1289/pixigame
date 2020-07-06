import { Entity } from './Entity';
import { CollisionTag } from './tags/CollisionTag';
import { CircleCollider } from './attributes/Collider';
import { InertialTag } from './tags/InertialTag';
import { Root } from '../game/Root';
import { Point } from '../physics/Point';
import { EntityGraphicsTag } from './tags/EntityGraphicsTag';
import { ExitFrameTag } from './tags/ExitFrameTag';
import { EnterFrameTag } from './tags/EnterFrameTag';
import { LabelTag } from './tags/LabelTag';

export class TargetDummy extends Entity {
    collider = CircleCollider(0, 0, 20);
    velocity = new Point();
    graphicsContainer = new PIXI.Container();

    constructor(root: Root) {
        super(root);

        const graphic = new PIXI.Graphics();
        graphic.beginFill(0x0000FF);
        graphic.drawCircle(0, 0, 20);
        this.graphicsContainer.addChild(graphic);

        this.tags = [
            new CollisionTag(this.collider),
            new InertialTag(this.collider, this.velocity),
            new EnterFrameTag(() => this.updateImpulse()),
            new ExitFrameTag(() => this.updateGraphics()),
            new EntityGraphicsTag(this.graphicsContainer),
            new (LabelTag('enemy'))(),
        ];
    }

    private updateImpulse() {
        if (this.velocity.length > 6) {
            this.velocity.length = 5;
        } else {
            this.velocity.length *= 0.83;
        }

        if (this.velocity.length < 0.1) {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
    }

    private updateGraphics() {
        this.graphicsContainer.x = this.collider.x;
        this.graphicsContainer.y = this.collider.y;
    }
}