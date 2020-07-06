import { Entity, TagType, Tag } from '../Entity';
import { SwingCollider } from '../attributes/Collider';
import { Root } from '../../game/Root';
import { TransientTag } from '../tags/TransientTag';
import { HitboxTag } from '../tags/HitboxTag';
import { EntityGraphicsTag } from '../tags/EntityGraphicsTag';

export class SwingHitbox extends Entity {
    graphicsContainer = new PIXI.Container();

    constructor(root: Root, public collider: SwingCollider, ...hitIdentities: TagType<Tag>[]) {
        super(root);

        const graphic = new PIXI.Graphics();
        graphic.beginFill(0x00FF00);
        graphic.moveTo(0, 0);
        graphic.lineTo(Math.sin(Math.PI / 4) * 60, Math.cos(Math.PI / 4) * 60);
        graphic.lineTo(0, 60);
        graphic.lineTo(-Math.sin(Math.PI / 4) * 60, Math.cos(Math.PI / 4) * 60);
        graphic.endFill();
        this.graphicsContainer.addChild(graphic);

        this.graphicsContainer.rotation = collider.direction;
        this.graphicsContainer.x = collider.x;
        this.graphicsContainer.y = collider.y;

        this.tags = [
            new TransientTag(),
            new HitboxTag(collider, hitIdentities),
            new EntityGraphicsTag(this.graphicsContainer)
        ];
    }
}