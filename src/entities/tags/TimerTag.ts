import { Tag } from '../Entity';

export class TimerTag implements Tag {
    public static TYPE = Symbol('Timer');

    public readonly type = TimerTag.TYPE;

    constructor(public callback: () => void, public delay: number) { }
}