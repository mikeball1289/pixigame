import { bindKeys } from './game/io';
import './polyfill';
import { Root } from './game/Root';
import { EnterFrameDriver } from './drivers/EnterFrameDriver';
import { ExitFrameDriver } from './drivers/ExitFrameDriver';
import { GraphicsDriver } from './drivers/GraphicsDriver';
import { PhysicsDriver } from './drivers/PhysicsDriver';
import { GameInitDriver } from './drivers/GameInitDriver';
import { CameraDriver } from './drivers/CameraDriver';

function main() {
    bindKeys();

    const app = new PIXI.Application({
        width: 1040,
        height: 860,
        backgroundColor: 0xaa0000
    });
    document.body.appendChild(app.view);
    
    const graphicsDriver = new GraphicsDriver();
    app.stage.addChild(graphicsDriver.stage);

    new Root([
        new GameInitDriver(),
        new EnterFrameDriver(),
        new PhysicsDriver(),
        graphicsDriver,
        new ExitFrameDriver(),
        new CameraDriver(graphicsDriver.gameContainer),
    ]);
}

window.addEventListener('load', main);