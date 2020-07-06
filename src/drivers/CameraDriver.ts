import { Driver } from './Driver';
import { withTag } from '../entities/Entity';
import { EnterFrameTag } from '../entities/tags/EnterFrameTag';
import { Root } from '../game/Root';
import { EnterFrameEvent } from '../game/Events';
import { CollisionTag } from '../entities/tags/CollisionTag';
import { LabelTag } from '../entities/tags/LabelTag';

export class CameraDriver extends Driver {

    constructor(private gameContainer: PIXI.Container) {
        super();
    }

    register(root: Root) {
        super.register(root);
        root.eventStream.addEventListener(EnterFrameEvent.type, () => this.update());
    }

    update() {
        const player = this.root.entities.find(withTag(LabelTag('player')));
        if (!player) {
            return;
        }
        const playerCollider = player.getTag(CollisionTag).collider;
        this.gameContainer.x = -playerCollider.x + 520;
        this.gameContainer.y = -playerCollider.y + 430;
    }

}