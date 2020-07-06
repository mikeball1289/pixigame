import { MouseButton } from "../polyfill";

const keys: { [code: number]: boolean } = {};

export function bindKeys() {
    window.addEventListener('keydown', e => {
        keys[e.keyCode] = true;
    });
    
    window.addEventListener('keyup', e => {
        keys[e.keyCode] = false;
    });
}

export function isKeyDown(keyCode: number) {
    return keys.hasOwnProperty(keyCode) && keys[keyCode];
}

let enterFrameFunction: () => void;

export function onEnterFrame(cb: () => void) {
    if (!enterFrameFunction) {
        const tick = () => {
            enterFrameFunction();
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }
    enterFrameFunction = cb;
}

const mouse = {
    position: {
        x: 0,
        y: 0,
    },
    buttons: {} as { [button: number]: boolean }
};

export function bindMouse(target: HTMLCanvasElement) {
    window.addEventListener('mousemove', e => {
        const bounds = target.getBoundingClientRect();
        const relativeX = e.clientX - bounds.x;
        const relativeY = e.clientY - bounds.y;
        const scaleX = target.width / bounds.width;
        const scaleY = target.height / bounds.height;
        mouse.position = {
            x: relativeX * scaleX,
            y: relativeY * scaleY,
        };
    });

    window.addEventListener('mousedown', e => {
        e.preventDefault();
        mouse.buttons[e.button] = true;
    });

    window.addEventListener('mouseup', e => {
        e.preventDefault();
        mouse.buttons[e.button] = false;
    });

    window.addEventListener('contextmenu', e => {
        e.preventDefault();
        return false;
    });
}

export function isMouseDown(button: MouseButton) {
    return mouse.buttons.hasOwnProperty(button) && mouse.buttons[button];
}

export function getMousePosition(relativeTo?: PIXI.DisplayObject) {
    if (relativeTo == null) {
        return { ...mouse.position };
    } else {
        const localPoint = relativeTo.toLocal(new PIXI.Point(mouse.position.x, mouse.position.y));
        return {
            x: localPoint.x,
            y: localPoint.y,
        }
    }
}