const keys: { [code: number]: boolean } = {};

export function bindKeys() {
    window.addEventListener('keydown', e => {
        e.preventDefault();
        keys[e.keyCode] = true;
    });
    
    window.addEventListener('keyup', e => {
        e.preventDefault();
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
    buttons: {
        left: false,
        right: false,
    }
};

export function bindMouse(target: HTMLCanvasElement) {
    window.addEventListener('mousemove', e => {
        console.log(e.clientX, e.clientY);
        console.log(target.getBoundingClientRect());
        console.log(target.width, target.height);
    });

    window.addEventListener('mousedown', e => {
        e.preventDefault();
        console.log(e.button);
    });

    window.addEventListener('mouseup', e => {
        e.preventDefault();
        console.log(e.button);
    })
}