import { Driver } from './Driver';
import { withTag } from '../entities/Entity';
import { EnterFrameTag } from '../entities/tags/EnterFrameTag';
import { Root } from '../game/Root';
import { EnterFrameEvent } from '../game/Events';

export class EnterFrameDriver extends Driver {

    register(root: Root) {
        super.register(root);
        root.eventStream.addEventListener(EnterFrameEvent.type, () => this.update());
    }

    update() {
        console.log('onenterframe');
        for (const entity of this.root.entities.filter(withTag(EnterFrameTag))) {
            entity.getTag(EnterFrameTag).onEnterFrame();
        }
    }

}