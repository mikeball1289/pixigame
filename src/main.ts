import { Game } from './game/Game';
import { bindKeys, onEnterFrame } from './game/io';
import './polyfill';
import { Root } from './game/Root';
import { EnterFrameDriver } from './drivers/EnterFrameDriver';
import { GraphicsDriver } from './drivers/GraphicsDriver';
import { PhysicsDriver } from './drivers/PhysicsDriver';
import { GameInitDriver } from './drivers/GameInitDriver';

function main() {
    bindKeys();
    // const game = new Game();
    // onEnterFrame(() => game.update());
    const graphicsDriver = new GraphicsDriver();

    new Root([
        new EnterFrameDriver(),
        new PhysicsDriver(),
        new GameInitDriver(),
        graphicsDriver,
    ]);
}

window.addEventListener('load', main);