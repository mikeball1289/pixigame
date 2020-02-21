import { Driver } from "./Driver";
import { Entity, withTag } from "../entities/Entity";
import { InertialTag } from "../entities/tags/InertialTag";
import { CollisionTag } from "../entities/tags/CollisionTag";

export class PhysicsDriver extends Driver {

    update(entities: Entity[]) {
        const inertialEntities = entities.filter(withTag(InertialTag));
        for (const entity of inertialEntities) {
            const it = entity.getTag(InertialTag);
            it.position.x += it.velocity.x;
            it.position.y += it.velocity.y;
        }

        const collidingEntities = entities.filter(withTag(CollisionTag));
        
        // do collision detection between soft entities

        // do collision detection with walls
    }

}