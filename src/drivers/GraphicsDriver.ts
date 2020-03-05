import { Driver } from './Driver';
import { Entity } from '../entities/Entity';
import { Root } from '../game/Root';
import { RegisterEntityEvent, isEvent } from '../game/Events';

export class GraphicsDriver extends Driver {

    stage = new PIXI.Container();

    register(root: Root) {
        super.register(root);
        root.eventStream.addEventListener(RegisterEntityEvent.type, (ev: Event) => {
            if (isEvent(ev, RegisterEntityEvent)) {
                this.handleAdd(ev.detail);
            }
        });
    }

    handleAdd(entity: Entity) {
        console.log('entity added', entity);
    }

}