import { Tag } from '../Entity';

export class EnterFrameTag implements Tag {
    public static TYPE = Symbol('EnterFrame');

    public readonly type = EnterFrameTag.TYPE;

    constructor(public onEnterFrame: () => void) { }
}