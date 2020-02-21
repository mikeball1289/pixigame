export const pair = <T, V>(first: T, second: V): [T, V] => [first, second];

export const maxBy = <T>(arr: T[], pred: (el: T, index: number, arr: T[]) => number) => arr.reduce((prev: [T | undefined, number], el, i, arr) => {
    const val = pred(el, i, arr);
    return val >= prev[1] ? pair(el, val) : prev;
}, [undefined, -Infinity])[0];

export const minBy = <T>(arr: T[], pred: (el: T, index: number, arr: T[]) => number) => maxBy(arr, (el, i, arr) => -pred(el, i, arr));