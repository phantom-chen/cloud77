export function add(x: number, y: number): number {
    if (x < 0 || y < 0) {
        return 0
    } else {
        return x + y
    }
}