import { Entity } from './Entity';
import { CollisionTag } from './tags/CollisionTag';
import { CircleCollider, SwingCollider } from './attributes/Collider';
import { EnterFrameTag } from './tags/EnterFrameTag';
import { InertialTag } from './tags/InertialTag';
import { isKeyDown, getMousePosition, isMouseDown } from '../game/io';
import { Key, MouseButton } from '../polyfill';
import { Root } from '../game/Root';
import { Point } from '../physics/Point';
import { EntityGraphicsTag } from './tags/EntityGraphicsTag';
import { ExitFrameTag } from './tags/ExitFrameTag';
import { angleOf } from '../utils/geometry';
import { TimerTag } from './tags/TimerTag';
import { SwingHitbox } from './attacks/SwingHitbox';
import { LabelTag } from './tags/LabelTag';

export class Player extends Entity {
    collider = CircleCollider(0, 0, 20);
    velocity = new Point();
    graphicsContainer = new PIXI.Container();
    
    private get facing() {
        const parent = this.graphicsContainer.parent;
        if (parent) {
            const relativeMouse = getMousePosition(parent);
            return angleOf(relativeMouse.x - this.graphicsContainer.x, relativeMouse.y - this.graphicsContainer.y);
        }
        return 0;
    }

    constructor(root: Root) {
        super(root);

        const player = new PIXI.Graphics();
        player.beginFill(0xFFFFFF);
        player.drawCircle(0, 0, 20);
        player.moveTo(-18, 11);
        player.lineTo(0, 27);
        player.lineTo(18, 11);
        player.endFill();

        this.graphicsContainer.addChild(player);

        this.tags = [
            new (LabelTag('player'))(),
            new CollisionTag(this.collider),
            new InertialTag(this.collider, this.velocity),
            new EnterFrameTag(() => this.updateImpulse()),
            new EnterFrameTag(() => this.updateControls()),
            new ExitFrameTag(() => this.updateGraphics()),
            new EntityGraphicsTag(this.graphicsContainer),
        ];
    }

    private updateImpulse() {
        if (isKeyDown(Key.W)) {
            this.velocity.y -= 1;
        } else if (isKeyDown(Key.S)) {
            this.velocity.y += 1;
        }

        if (isKeyDown(Key.A)) {
            this.velocity.x -= 1;
        } else if (isKeyDown(Key.D)) {
            this.velocity.x += 1;
        }

        const speedCap = this.hasTag(LabelTag('attacking')) ? 4 : 6;
        if (this.velocity.length > speedCap) {
            this.velocity.length = speedCap * 0.83;
        } else {
            this.velocity.length *= 0.83;
        }

        if (this.velocity.length < 0.1) {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
    }

    private updateControls() {
        if (isMouseDown(MouseButton.LEFT) && !this.hasTag(LabelTag('actioncooldown'))) {
            const actionCooldownTag = new (LabelTag('actioncooldown'))();
            const attackingTag = new (LabelTag('attacking'))();
            this.addTag(actionCooldownTag);
            this.addTag(attackingTag);
            this.addTag(new TimerTag(() => this.removeTag(actionCooldownTag), 50));
            this.addTag(new TimerTag(() => this.removeTag(attackingTag), 20));
            this.addTag(new TimerTag(() => this.root.register(new SwingHitbox(
                this.root,
                SwingCollider(this.collider.x, this.collider.y, 60, this.facing, Math.PI / 2),
                LabelTag('enemy')
            )), 10));
        }
    }

    private updateGraphics() {
        this.graphicsContainer.x = this.collider.x;
        this.graphicsContainer.y = this.collider.y;

        this.graphicsContainer.rotation = this.facing;
    }

}