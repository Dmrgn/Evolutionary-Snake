import { ADJ_DIRS, DIRS, MAP_HEIGHT, MAP_WIDTH, SNAKE_DRAW_HEIGHT, SNAKE_DRAW_WIDTH, SNAKE_MUTATION_AMOUNT, WALL_LINES } from './constants.js';
import geometric from 'geometric';

export function shortestDistanceIntersectionOfPointsAndLine(points, line, shouldDraw) {
    let min = Number.MAX_SAFE_INTEGER;
    // if (shouldDraw) {
        // r.DrawLine(line[0][0]*SNAKE_DRAW_WIDTH, line[0][1]*SNAKE_DRAW_WIDTH, line[1][0]*SNAKE_DRAW_WIDTH, line[1][1]*SNAKE_DRAW_WIDTH, r.ORANGE);
    // }
    points.forEach(point => {
        if (geometric.pointOnLine([point.x+0.5, point.y+0.5], line, 1)) {
            // if (shouldDraw) {
                // r.DrawCircle(point.x*SNAKE_DRAW_WIDTH, point.y*SNAKE_DRAW_HEIGHT, 5, r.PINK);
                // r.DrawLine(line[0][0]*SNAKE_DRAW_WIDTH, line[0][1]*SNAKE_DRAW_WIDTH, line[1][0]*SNAKE_DRAW_WIDTH, line[1][1]*SNAKE_DRAW_WIDTH, r.PINK);
            // }
            const distance = geometric.lineLength([[point.x+0.5, point.y+0.5], line[0]]);
            if (distance < min) min = distance;
        }
    });
    return min === Number.MAX_SAFE_INTEGER ? -1 : min;
}
export function createEmptyMap() {
    let map = [];
    for (let i = 0; i < MAP_HEIGHT; i++) {
        map.push([]);
        for (let j = 0; j < MAP_WIDTH; j++) {
            map[i].push(0);
        }
    }
    return map;
}
export function flattenMap(map) {
    let flattened = [];
    for (let i = 0; i < MAP_HEIGHT; i++) {
        for (let j = 0; j < MAP_WIDTH; j++) {
            flattened.push(map[i][j]);
        }
    }
    return flattened;
}
export function posToRowColArr(pos) {
    let rowCol = [];
    for (let i = 0; i < MAP_WIDTH; i++) {
        if (pos.x === i) rowCol.push(1) 
        else rowCol.push(0);
    }
    for (let i = 0; i < MAP_HEIGHT; i++) {
        if (pos.y === i) rowCol.push(1) 
        else rowCol.push(0);
    }
    return rowCol;
}