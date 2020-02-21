import { Entity } from "../entities/Entity";

export abstract class Driver {
    abstract update(entities: Entity[]): void;
}