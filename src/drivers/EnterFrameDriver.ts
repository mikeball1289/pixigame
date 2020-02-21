import { Driver } from "./Driver";
import { Entity, withTag } from "../entities/Entity";
import { EnterFrameTag } from "../entities/tags/EnterFrameTag";

export class EnterFrameDriver extends Driver {

    update(entities: Entity[]) {
        for (const entity of entities.filter(withTag(EnterFrameTag))) {
            entity.getTag(EnterFrameTag).onEnterFrame();
        }
    }

}