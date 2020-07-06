import { Tag } from '../Entity';

export class TransientTag implements Tag {
    public static TYPE = Symbol('Transient');

    public readonly type = TransientTag.TYPE;

    constructor(public frameTime: number = 0) { }
}