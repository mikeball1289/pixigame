import { Driver } from './Driver';
import { Entity, withTag } from '../entities/Entity';
import { InertialTag } from '../entities/tags/InertialTag';
import { CollisionTag } from '../entities/tags/CollisionTag';
import { MapTag } from '../entities/tags/MapTag';
import { dieOr } from '../utils/typesafe';
import { Root } from '../game/Root';
import { EnterFrameEvent } from '../game/Events';

export class PhysicsDriver extends Driver {

    register(root: Root) {
        super.register(root);
        root.eventStream.addEventListener(EnterFrameEvent.type, () => this.update());
    }

    update() {
        const inertialEntities = this.root.entities.filter(withTag(InertialTag));
        for (const entity of inertialEntities) {
            const it = entity.getTag(InertialTag);
            it.position.x += it.velocity.x;
            it.position.y += it.velocity.y;
        }

        const collidingEntities = this.root.entities.filter(withTag(CollisionTag));
        const mapGeometry = dieOr(this.root.entities.find(withTag(MapTag)));
        
        // do collision detection between soft entities

        // do collision detection with walls
    }

}