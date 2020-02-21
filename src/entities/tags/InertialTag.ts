import { Tag } from "../Entity";
import { Point } from "../../physics/Point";

export class InertialTag implements Tag {
    public static TYPE = Symbol('Inertial');

    public readonly type = InertialTag.TYPE;

    constructor(public position: { x: number, y: number }, public velocity: Point) { }
}