import { Driver } from './Driver';
import { Entity, withTag } from '../entities/Entity';
import { InertialTag } from '../entities/tags/InertialTag';
import { CollisionTag } from '../entities/tags/CollisionTag';
import { MapTag } from '../entities/tags/MapTag';
import { Root } from '../game/Root';
import { EnterFrameEvent } from '../game/Events';
import { circleCollidesWithMap, circleCollidesWithCircle, CollisionDetails } from '../entities/attributes/Collider';

export class PhysicsDriver extends Driver {

    register(root: Root) {
        super.register(root);
        root.eventStream.addEventListener(EnterFrameEvent.type, () => this.update());
    }

    update() {
        const inertialEntities = this.root.entities.filter(withTag(InertialTag));
        this.updateImpulses(inertialEntities);

        const collidingEntities = this.root.entities.filter(withTag(CollisionTag));

        // do collision detection between soft entities
        this.entityCollision(collidingEntities);

        // do collision detection with walls
        const mapEntity = this.root.entities.find(withTag(MapTag));
        this.wallCollision(collidingEntities, mapEntity);

        // do hitbox detection
    }

    /**
     * 
     * @param inertialEntities A list of entities _with InertialTags_
     */
    private updateImpulses(inertialEntities: Entity[]) {
        for (const entity of inertialEntities) {
            const it = entity.getTag(InertialTag);
            it.position.x += it.velocity.x;
            it.position.y += it.velocity.y;
        }
    }

    /**
     * 
     * @param collidingEntities A list of entities _with CollisionTags_
     */
    private entityCollision(collidingEntities: Entity[]) {
        for (let i = 0; i < collidingEntities.length - 1; i ++) {
            for (let j = i + 1; j < collidingEntities.length; j ++) {
                const collider1 = collidingEntities[i].getTag(CollisionTag).collider;
                const collider2 = collidingEntities[j].getTag(CollisionTag).collider;
                const details = circleCollidesWithCircle(collider1, collider2);
                if (details && this.nonNaNDetails(details)) {
                    collider1.x += details.decollide1.x / 4;
                    collider1.y += details.decollide1.y / 4;

                    collider2.x += details.decollide2.x / 4;
                    collider2.y += details.decollide2.y / 4;
                }
            }
        }
    }

    private nonNaNDetails(details: CollisionDetails) {
        return !isNaN(details.decollide1.x) && !isNaN(details.decollide1.y) &&
               !isNaN(details.decollide2.x) && !isNaN(details.decollide2.y);
    }

    /**
     * 
     * @param collidingEntities A list of entities _with CollisionTags_
     * @param mapEntity An entitiy _with MapTag_
     */
    private wallCollision(collidingEntities: Entity[], mapEntity?: Entity) {
        if (!mapEntity) {
            return;
        }

        const mapGeometry = mapEntity.getTag(MapTag).geometry;

        for (const entity of collidingEntities) {
            const collider = entity.getTag(CollisionTag).collider;
            const details = circleCollidesWithMap(collider, mapGeometry);
            if (details) {
                collider.x += details.decollide1.x;
                collider.y += details.decollide1.y;
            }
        }
    }

}