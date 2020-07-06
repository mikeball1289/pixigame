import { Driver } from './Driver';
import { withTag, withTags } from '../entities/Entity';
import { Root } from '../game/Root';
import { EnterFrameEvent } from '../game/Events';
import { ExitFrameTag } from '../entities/tags/ExitFrameTag';
import { HitboxTag } from '../entities/tags/HitboxTag';
import { CollisionTag } from '../entities/tags/CollisionTag';
import { swingHitsCircle } from '../entities/attributes/Collider';
import { InertialTag } from '../entities/tags/InertialTag';

export class HitboxDriver extends Driver {

    register(root: Root) {
        super.register(root);
        root.eventStream.addEventListener(EnterFrameEvent.type, () => this.update());
    }

    update() {
        const hittableEntities = this.root.entities.filter(withTag(CollisionTag));
        for (const hitbox of this.root.entities.filter(withTag(HitboxTag))) {
            const hitboxTag = hitbox.getTag(HitboxTag);
            for (const entity of hittableEntities.filter(withTags(...hitboxTag.hitIdentities))) {
                const hit = swingHitsCircle(hitbox.getTag(HitboxTag).collider, entity.getTag(CollisionTag).collider);
                if (hit && entity.hasTag(InertialTag)) {
                    const velocity = entity.getTag(InertialTag).velocity;
                    velocity.x += hit.decollide2.x / 3;
                    velocity.y += hit.decollide2.y / 3;
                }
            }
        }
    }

}