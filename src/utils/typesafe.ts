export function dieOr<T>(obj: T | null | undefined): T {
    if (obj === null) throw new Error(`Object ${String(obj)} was null`);
    if (obj === undefined) throw new Error(`Object ${String(obj)} was undefined`);
    return obj;
}