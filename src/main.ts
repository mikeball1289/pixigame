import { Game } from './game/Game';
import { bindKeys, onEnterFrame } from './game/io';
import './polyfill';

function main() {
    bindKeys();
    const game = new Game();
    onEnterFrame(() => game.update());
}

window.addEventListener('load', main);