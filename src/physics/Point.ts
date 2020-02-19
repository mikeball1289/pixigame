export class Point {
    constructor(public x = 0, public y = 0) { }

    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    set length(l: number) {
        const r = l / this.length;
        this.x *= r;
        this.y *= r;
    }

    clone() {
        return new Point(this.x, this.y);
    }

    normalize() {
        const newPoint = this.clone();
        newPoint.length = 1;
        return newPoint;
    }
}