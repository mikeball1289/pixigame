export class Point {
    constructor(public x = 0, public y = 0) { }

    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    set length(l: number) {
        if (this.x === 0 && this.y === 0) {
            this.x = l;
        } else {
            const r = l / this.length;
            this.x *= r;
            this.y *= r;
        }
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