import { Entity } from './Entity';
import { CollisionTag } from './tags/CollisionTag';
import { CircleCollider } from './attributes/Collider';
import { InertialTag } from './tags/InertialTag';
import { Root } from '../game/Root';
import { Point } from '../physics/Point';
import { EntityGraphicsTag } from './tags/EntityGraphicsTag';
import { ExitFrameTag } from './tags/ExitFrameTag';

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
            new ExitFrameTag(() => this.updateGraphics()),
            new EntityGraphicsTag(this.graphicsContainer),
        ];
    }

    private updateGraphics() {
        this.graphicsContainer.x = this.collider.x;
        this.graphicsContainer.y = this.collider.y;
    }
}