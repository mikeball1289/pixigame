import { Tag } from '../Entity';

export class ExitFrameTag implements Tag {
    public static TYPE = Symbol('ExitFrame');

    public readonly type = ExitFrameTag.TYPE;

    constructor(public onExitFrame: () => void) { }
}