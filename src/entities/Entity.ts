import { Root } from '../game/Root';

export interface Tag {
    type: Symbol;
}

export interface TagType<T extends Tag> {
    TYPE: Symbol;
    new(...rest: any[]): T;
}

export const withTag = <T extends Tag>(t: TagType<T>) => (e: Entity) => e.hasTag(t);

export class Entity {
    protected tags: Tag[] = [];

    constructor(public root: Root) { }

    hasTag<T extends Tag>(type: TagType<T>) {
        return this.tags.some(t => t.type === type.TYPE);
    }

    getTag<T extends Tag>(type: TagType<T>): T {
        const res = this.tags.find(t => t.type === type.TYPE);
        if (res === undefined) throw new Error(`Entity ${this} has no tag ${type.TYPE}`);
        return res as T;
    }

    getTagOrDefault<T extends Tag, V = undefined>(type: TagType<T>, alt: V = undefined as any): T | V {
        return this.tags.find(t => t.type === type.TYPE) as T ?? alt;
    }

    getTags<T extends Tag>(type: TagType<T>): T[] {
        return this.tags.filter(t => t.type === type.TYPE) as T[];
    }
}