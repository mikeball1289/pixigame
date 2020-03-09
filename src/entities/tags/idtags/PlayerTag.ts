import { Tag } from '../../Entity';

export class PlayerTag implements Tag {
    public static TYPE = Symbol('Player');

    public readonly type = PlayerTag.TYPE;
}