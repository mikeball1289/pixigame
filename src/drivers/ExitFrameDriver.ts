import { Driver } from './Driver';
import { withTag } from '../entities/Entity';
import { Root } from '../game/Root';
import { EnterFrameEvent } from '../game/Events';
import { ExitFrameTag } from '../entities/tags/ExitFrameTag';

export class ExitFrameDriver extends Driver {

    register(root: Root) {
        super.register(root);
        root.eventStream.addEventListener(EnterFrameEvent.type, () => this.update());
    }

    update() {
        for (const entity of this.root.entities.filter(withTag(ExitFrameTag))) {
            entity.getTag(ExitFrameTag).onExitFrame();
        }
    }

}