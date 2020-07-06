export function angleOf(dx: number, dy: number) {
    let rotation = -Math.atan(dx / dy);
    if (dy < 0) {
        rotation += Math.PI;
    }
    return rotation;
}