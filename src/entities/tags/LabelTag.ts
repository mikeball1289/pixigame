import { TagType, Tag } from '../Entity';

interface LabelTagType {
    TYPE: Symbol;
    new(): Tag;
}

const tagCache: { [label: string]: LabelTagType } = {}

export function LabelTag(label: string) {
    if (label in tagCache) return tagCache[label];
    
    const type = Symbol(label);
    return tagCache[label] = class {
        static readonly TYPE = type;
        public readonly type = type;
    };
}