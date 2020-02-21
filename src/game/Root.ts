import { Entity } from "../entities/Entity";
import { Driver } from "../drivers/Driver";

export class Root {
    entities: Entity[] = [];
    
    constructor(public drivers: Driver[]) {

    }

    register(entity: Entity) {
        this.entities.push(entity);
    }

    deregister(entity: Entity) {
        const idx = this.entities.indexOf(entity);
        if (idx < 0) return;
        this.entities.splice(idx, 1);
    }
}