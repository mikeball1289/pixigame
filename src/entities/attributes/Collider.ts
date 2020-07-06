import { Point } from '../../physics/Point';
import { MapGeometry } from './MapGeometry';
import { maxBy } from '../../utils/arrays';
import { angleOf } from '../../utils/geometry';

export interface CollisionDetails {
    amount: number;
    decollide1: Point;
    decollide2: Point;
}

export interface PointCollider {
    x: number;
    y: number;
}

export interface CircleCollider extends PointCollider {
    radius: number;
}

export interface SwingCollider extends CircleCollider {
    direction: number;
    angle: number;
}

export interface LineCollider {
    start: PointCollider;
    end: PointCollider;
}

export function CircleCollider(x: number, y: number, radius: number): CircleCollider {
    return { x, y, radius };
}

export function SwingCollider(x: number, y: number, radius: number, direction: number, angle: number): SwingCollider {
    return { x, y, radius, direction, angle };
}

interface RectCollider extends PointCollider {
    width: number;
    height: number;
}

export function circleCollidesWithCircle(c1: CircleCollider, c2: CircleCollider): CollisionDetails | null {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const delta2 = dx * dx + dy * dy;
    const rt = c1.radius + c2.radius;
    const r2 = rt * rt;
    if (delta2 >= r2) {
        return null;
    } else {
        const delta = Math.sqrt(delta2);
        const amount = rt - delta;
        if (delta === 0) {
            return {
                amount,
                decollide1: new Point(c1.radius, 0),
                decollide2: new Point(-c2.radius, 0)
            }
        } else {
            return {
                amount,
                decollide1: new Point(dx / delta * amount * c1.radius / rt, dy / delta * amount * c1.radius / rt),
                decollide2: new Point(-dx / delta * amount * c2.radius / rt, -dy / delta * amount * c1.radius / rt)
            };
        }
    }
}

export function swingHitsCircle(c1: SwingCollider, c2: CircleCollider): CollisionDetails | null {
    function resolveSwingCollision() {
        const details = circleCollidesWithCircle(c1, c2);
        if (!details) return null;
        return {
            amount: details.amount,
            decollide1: new Point(),
            decollide2: new Point(details.decollide2.x - details.decollide1.x, details.decollide2.y - details.decollide1.y),
        }
    }

    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;
    const angle = angleOf(dx, dy);
    const da = c1.direction - angle;
    const boundedda = ((da + Math.PI) % (Math.PI * 2) - Math.PI);
    // if the target circle is within the arc of the swing
    if (Math.abs(boundedda) <= c1.angle / 2) {
        return resolveSwingCollision();
    }
    // otherwise check the edges of the swing
    const r1 = c1.direction + c1.angle / 2;
    const r2 = c1.direction - c1.angle / 2;
    const l1: LineCollider = {
        start: { x: c1.x, y: c1.y },
        end: {
            x: c1.x - Math.sin(r1) * c1.radius,
            y: c1.y + Math.cos(r1) * c1.radius
        }
    }
    const l2: LineCollider = {
        start: { x: c1.x, y: c1.y },
        end: {
            x: c1.x - Math.sin(r2) * c1.radius,
            y: c1.y + Math.cos(r2) * c1.radius
        }
    }
    if (circleCollidesWithLine(c2, l1) || circleCollidesWithLine(c2, l2)) {
        return resolveSwingCollision();
    }
    return null;
}

export function circleCollidesWithLine(c1: CircleCollider, c2: LineCollider): { x: number, y: number } | null {
    const dx = c2.end.x - c2.start.x;
    const dy = c2.end.y - c2.start.y;
    const length2 = dx * dx + dy * dy;
    const dot = (((c1.x - c2.start.x) * (c2.end.x - c2.start.x)) + ((c1.y - c2.start.y) * (c2.end.y - c2.start.y))) / length2;

    if (dot < 0 || dot > 1) {
        if (circleContainsPoint(c1, c2.start)) return { ...c2.start };
        if (circleContainsPoint(c1, c2.end)) return { ...c2.end };
        return null;
    }

    const closest = {
        x: c2.start.x + (dot * (c2.end.x - c2.start.x)),
        y: c2.start.y + (dot * (c2.end.y - c2.start.y)),
    }

    if (circleContainsPoint(c1, closest)) return closest;
    return null;
}

export function circleCollidesWithMap(c1: CircleCollider, map: MapGeometry): CollisionDetails | null {
    const covers: { x: number, y: number }[] = [];
    for (let x = c1.x - c1.radius; x < c1.x + c1.radius + map.tileSize; x += map.tileSize) {
        for (let y = c1.y - c1.radius; y < c1.y + c1.radius + map.tileSize; y += map.tileSize) {
            covers.push(tileAt(x, y, map.tileSize));
        }
    }

    const tileCollision = covers.map(xy => circleCollidesWithTile(c1, map, xy));
    if (!tileCollision.some(tc => tc != null)) return null;

    const decollisionVector = tileCollision.reduce((total, tc) => {
        if (!tc) return total;
        return new Point(maxBy([total.x, tc.decollide1.x], n => Math.abs(n)), maxBy([total.y, tc.decollide1.y], n => Math.abs(n)))
    }, new Point(0, 0));

    return {
        amount: decollisionVector.length,
        decollide1: decollisionVector,
        decollide2: new Point()
    };
}

function circleCollidesWithTile(c1: CircleCollider, map: MapGeometry, xy: { x: number, y: number }): CollisionDetails | null {
    if (map.tiles.get(xy.x, xy.y) != 0) return null;
    
    const tile: RectCollider = {
        x: xy.x * map.tileSize,
        y: xy.y * map.tileSize,
        width: map.tileSize,
        height: map.tileSize
    };
    
    if (tileContainsPoint({ x: c1.x + c1.radius, y: c1.y }, tile)) {
        const amount = c1.x + c1.radius - tile.x;
        return { amount, decollide1: new Point(-amount, 0), decollide2: new Point() };
    }
    
    if (tileContainsPoint({ x: c1.x - c1.radius, y: c1.y }, tile)) {
        const amount = (tile.x + tile.width) - (c1.x - c1.radius);
        return { amount, decollide1: new Point(amount, 0), decollide2: new Point() };
    }
    
    if (tileContainsPoint({ x: c1.x, y: c1.y + c1.radius }, tile)) {
        const amount = c1.y + c1.radius - tile.y;
        return { amount, decollide1: new Point(0, -amount), decollide2: new Point() };
    }
    
    if (tileContainsPoint({ x: c1.x, y: c1.y - c1.radius }, tile)) {
        const amount = (tile.y + tile.height) - (c1.y - c1.radius);
        return { amount, decollide1: new Point(0, amount), decollide2: new Point() };
    }

    const corners = [{
        x: tile.x,
        y: tile.y
    }, {
        x: tile.x + tile.width,
        y: tile.y
    }, {
        x: tile.x + tile.width,
        y: tile.y + tile.height
    }, {
        x: tile.x,
        y: tile.y + tile.height
    }];

    const cornerCollisions = corners.map(c => circleContainsPoint(c1, c));

    return maxBy(cornerCollisions, cc => cc?.amount ?? -Infinity) || null;
}

function circleContainsPoint(c1: CircleCollider, c2: PointCollider): CollisionDetails | null {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const delta2 = dx * dx + dy * dy;
    
    if (delta2 > c1.radius * c1.radius) {
        return null;
    } else {
        const delta = Math.sqrt(delta2);
        const amount = c1.radius - delta;
        return {
            amount,
            decollide1: new Point(dx / delta * amount, dy / delta * amount),
            decollide2: new Point()
        }
    }
}

function tileContainsPoint(c1: PointCollider, c2: RectCollider): boolean {
    return c1.x > c2.x && c1.x < c2.x + c2.width && c1.y > c2.y && c1.y < c2.y + c2.height;
}

function tileAt(x: number, y: number, tileSize: number) {
    return { x: Math.floor(x / tileSize), y: Math.floor(y / tileSize) };
}