import { Driver } from './Driver';
import { withTag } from '../entities/Entity';
import { Root } from '../game/Root';
import { EnterFrameEvent } from '../game/Events';
import { TransientTag } from '../entities/tags/TransientTag';

export class TransientDriver extends Driver {

    register(root: Root) {
        super.register(root);
        root.eventStream.addEventListener(EnterFrameEvent.type, () => this.update());
    }

    update() {
        for (const entity of this.root.entities.filter(withTag(TransientTag))) {
            for (const tt of entity.getTags(TransientTag)) {
                tt.frameTime --;
                if (tt.frameTime < 0) {
                    this.root.deregister(entity);
                    break;
                }
            }
        }
    }

}