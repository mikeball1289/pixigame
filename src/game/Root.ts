import { Entity } from '../entities/Entity';
import { Driver } from '../drivers/Driver';
import { DeregisterEntityEvent, RegisterEntityEvent, InitializeGameEvent, EnterFrameEvent } from './Events';
import { onEnterFrame } from './io';

export class Root {
    entities: Entity[] = [];
    eventStream = new EventTarget();
    
    constructor(public drivers: Driver[]) {
        drivers.forEach(d => d.register(this));
        this.eventStream.dispatchEvent(new InitializeGameEvent());

        onEnterFrame(() => this.update());
    }

    update() {
        this.eventStream.dispatchEvent(new EnterFrameEvent());
    }

    register(entity: Entity) {
        this.entities.push(entity);
        this.eventStream.dispatchEvent(new RegisterEntityEvent(entity));
    }

    deregister(entity: Entity) {
        const idx = this.entities.indexOf(entity);
        if (idx < 0) return;
        this.entities.splice(idx, 1);
        this.eventStream.dispatchEvent(new DeregisterEntityEvent(entity));
    }
}