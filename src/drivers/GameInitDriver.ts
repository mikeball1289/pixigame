import { Driver } from './Driver';
import { Root } from '../game/Root';
import { Map } from '../entities/Map';
import { TILE_SIZE } from '../constants';
import { opts, DunGen } from '../../Dungen';
import { MapGeometry } from '../entities/attributes/MapGeometry';
import { Player } from '../entities/Player';
import { InitializeGameEvent } from '../game/Events';

export class GameInitDriver extends Driver {

    register(root: Root) {
        super.register(root);
        root.eventStream.addEventListener(InitializeGameEvent.type, () => this.initializeGame());
    }

    initializeGame() {
        if (!this.root) {
            alert('Failed to start game');
            throw new Error('Failed to start game');
        }
        const dungeon = DunGen(opts);
        const mapGeometry = new MapGeometry(dungeon.map, TILE_SIZE);
        this.root.register(new Map(this.root, mapGeometry));
        this.root.register(new Player(this.root));
    }
}