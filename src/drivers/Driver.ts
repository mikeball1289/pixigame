import { Entity } from '../entities/Entity';
import { Root } from '../game/Root';

export interface Event<P> {
    type: string;
    payload?: P;
}

export class Driver {
    private _root?: Root;

    get root() {
        if (!this._root) {
            throw new Error('Driver is not yet initialized');
        }
        return this._root;
    }

    register(root: Root) {
        this._root = root;
    }
}