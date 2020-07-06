import { bindKeys, bindMouse } from './game/io';
import './polyfill';
import { Root } from './game/Root';
import * as drivers from './drivers/index';

function main() {
    const app = new PIXI.Application({
        width: 1040,
        height: 860,
        backgroundColor: 0xaa0000
    });
    document.body.appendChild(app.view);
    
    bindKeys();
    bindMouse(app.view);

    const graphicsDriver = new drivers.GraphicsDriver();
    app.stage.addChild(graphicsDriver.stage);

    new Root([
        new drivers.TransientDriver(),
        new drivers.GameInitDriver(),
        new drivers.EnterFrameDriver(),
        new drivers.PhysicsDriver(),
        new drivers.TimerDriver(),
        new drivers.HitboxDriver(),
        graphicsDriver,
        new drivers.ExitFrameDriver(),
        new drivers.CameraDriver(graphicsDriver.gameContainer),
    ]);
}

window.addEventListener('load', main);