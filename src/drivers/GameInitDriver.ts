import { Driver } from './Driver';
import { Root } from '../game/Root';
import { Map } from '../entities/Map';
import { TILE_SIZE } from '../constants';
import { opts, DunGen } from '../../Dungen';
import { MapGeometry } from '../entities/attributes/MapGeometry';
import { Player } from '../entities/Player';
import { InitializeGameEvent } from '../game/Events';
import { CollisionTag } from '../entities/tags/CollisionTag';
import { TargetDummy } from '../entities/TargetDummy';

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
        const startingRoom = dungeon.rooms[Math.floor(Math.random() * dungeon.rooms.length)];

        const player = new Player(this.root);
        player.collider.x = (startingRoom.x + startingRoom.width / 2) * TILE_SIZE;
        player.collider.y = (startingRoom.y + startingRoom.height / 2) * TILE_SIZE;

        this.root.register(new Map(this.root, mapGeometry));
        this.root.register(player);

        for (const room of dungeon.rooms) {
            for (let i = 0; i < 12; i ++) {
                const dummy = new TargetDummy(this.root);
                dummy.collider.x = (Math.random() * room.width + room.x) * TILE_SIZE;
                dummy.collider.y = (Math.random() * room.height + room.y) * TILE_SIZE;
                this.root.register(dummy);
            }
        }
    }
}