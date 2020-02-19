import { DunGen, opts, DunGenPack } from "../../Dungen";
import { isKeyDown } from "./io";
import { Key } from "../polyfill";
import { TILE_SIZE } from "../constants";
import { Point } from "../physics/Point";

export class Game extends PIXI.Application {

    public dungeon: DunGenPack;

    private player: PIXI.Graphics;
    private gameContainer: PIXI.Container = new PIXI.Container();

    constructor() {
        super({
            width: 1040,
            height: 860,
            backgroundColor: 0xaa0000
        });
        document.body.appendChild(this.view);
        this.stage.addChild(this.gameContainer);

        this.dungeon = DunGen(opts);
        // console.log(dungeon);
        // console.log(dungeon.map.toString(x => x != 0 ? '█' : ' '));

        const mapGraphic = new PIXI.Container();
        for (let y = 0; y < this.dungeon.map.height; y ++) {
            for (let x = 0; x < this.dungeon.map.width; x ++) {
                if (this.dungeon.map.get(x, y) !== 0) {
                    let graphic = new PIXI.Graphics();
                    graphic.beginFill(0);
                    graphic.drawRect(0, 0, TILE_SIZE, TILE_SIZE);
                    graphic.x = x * TILE_SIZE;
                    graphic.y = y * TILE_SIZE;
                    mapGraphic.addChild(graphic);
                }
            }
        }
        this.gameContainer.addChild(mapGraphic);

        this.player = new PIXI.Graphics();
        this.player.beginFill(0xFFFFFF);
        this.player.drawCircle(0, 0, 20);
        this.gameContainer.addChild(this.player);

        const startingRoom = this.dungeon.rooms[Math.floor(Math.random() * this.dungeon.rooms.length)];
        this.player.x = (startingRoom.x + startingRoom.width / 2) * TILE_SIZE;
        this.player.y = (startingRoom.y + startingRoom.height / 2) * TILE_SIZE;
    }

    update() {
        this.updatePhysics();

        this.gameContainer.x = -this.player.x + this.view.width / 2;
        this.gameContainer.y = -this.player.y + this.view.height / 2;
    }

    updatePhysics() {
        const impulse = new Point();
        if (isKeyDown(Key.A)) {
            impulse.x = -5;
        }
        if (isKeyDown(Key.D)) {
            impulse.x = 5;
        }
        if (isKeyDown(Key.W)) {
            impulse.y = -5;
        }
        if (isKeyDown(Key.S)) {
            impulse.y = 5;
        }
        if (impulse.length > 5) {
            impulse.length = 5;
        };

        this.player.x += impulse.x;
        if (this.hasCollision()) {
            this.player.x -= impulse.x;
        }
     
        this.player.y += impulse.y;
        if (this.hasCollision()) {
            this.player.y -= impulse.y;
        }
    }

    hasCollision() {
        const evalTiles = [
            this.tileAt(this.player.x - 20, this.player.y - 20),
            this.tileAt(this.player.x - 20, this.player.y + 20),
            this.tileAt(this.player.x + 20, this.player.y - 20),
            this.tileAt(this.player.x + 20, this.player.y + 20),
        ];

        return evalTiles.some(({ x, y }) => this.dungeon.map.get(x, y) === 0);
        // const collisions = evalTiles.filter(({x, y}) => this.dungeon.map.get(x, y) === 0);
    }

    tileAt(x: number, y: number) {
        return { x: Math.floor(x / TILE_SIZE), y: Math.floor(y / TILE_SIZE) };
    }
}