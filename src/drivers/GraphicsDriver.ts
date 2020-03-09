import { Driver } from './Driver';
import { Entity } from '../entities/Entity';
import { Root } from '../game/Root';
import { RegisterEntityEvent, isEvent, DeregisterEntityEvent } from '../game/Events';
import { EntityGraphicsTag } from '../entities/tags/EntityGraphicsTag';
import { MapGraphicsTag } from '../entities/tags/MapGraphicsTag';

export class GraphicsDriver extends Driver {

    stage = new PIXI.Container();
    gameContainer = new PIXI.Container();
    uiContainer = new PIXI.Container();

    register(root: Root) {
        super.register(root);

        this.stage.addChild(this.gameContainer);
        this.stage.addChild(this.uiContainer);

        root.eventStream.addEventListener(RegisterEntityEvent.type, (ev: Event) => {
            if (isEvent(ev, RegisterEntityEvent)) {
                this.handleAdd(ev.detail);
            }
        });

        root.eventStream.addEventListener(DeregisterEntityEvent.type, (ev: Event) => {
            if (isEvent(ev, DeregisterEntityEvent)) {
                this.handleRemove(ev.detail);
            }
        });
    }

    handleAdd(entity: Entity) {
        const entityGraphicsTag = entity.getTagOrDefault(EntityGraphicsTag);
        const mapGraphicsTag = entity.getTagOrDefault(MapGraphicsTag);
        
        if (entityGraphicsTag) {
            this.gameContainer.addChild(entityGraphicsTag.graphic);
        }
        if (mapGraphicsTag) {
            this.gameContainer.addChildAt(mapGraphicsTag.mapGraphic, 0);
        }
    }

    handleRemove(entity: Entity) {
        const entityGraphicsTag = entity.getTagOrDefault(EntityGraphicsTag);
        const mapGraphicsTag = entity.getTagOrDefault(MapGraphicsTag);
        
        if (entityGraphicsTag) {
            this.gameContainer.removeChild(entityGraphicsTag.graphic);
        }
        if (mapGraphicsTag) {
            this.gameContainer.removeChild(mapGraphicsTag.mapGraphic);
        }

    }

}