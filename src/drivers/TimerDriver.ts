import { Driver } from './Driver';
import { withTag } from '../entities/Entity';
import { Root } from '../game/Root';
import { EnterFrameEvent } from '../game/Events';
import { TimerTag } from '../entities/tags/TimerTag';

export class TimerDriver extends Driver {

    register(root: Root) {
        super.register(root);
        root.eventStream.addEventListener(EnterFrameEvent.type, () => this.update());
    }

    update() {
        for (const entity of this.root.entities.filter(withTag(TimerTag))) {
            for (const tt of entity.getTags(TimerTag)) {
                tt.delay --;
                if (tt.delay < 0) {
                    tt.callback();
                    entity.removeTag(tt);
                }
            }
        }
    }

}