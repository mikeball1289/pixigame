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