export const NUM_SNAKES = 1000;
export const NUM_ALPHA_SNAKES = 50;
export const SNAKE_MUTATION_AMOUNT = 10;
export const MAX_FRAMES_SINCE_FOOD = 20;
export const MAX_GENERATION_DURATION = 50;
export const SLOW_FRAME_RATE = 10;
export const FAST_FRAME_RATE = 1000;
export const MAP_WIDTH = 11;
export const MAP_HEIGHT = 11;
export const SCREEN_WIDTH = 800;
export const SCREEN_HEIGHT = 800;
export const SAVE_EVERY_N_GENERATIONS = 10;
export const SAVE_FILE_NAME = "snake_save.json";

export const SNAKE_DRAW_WIDTH = SCREEN_WIDTH/MAP_WIDTH;
export const SNAKE_DRAW_HEIGHT = SCREEN_HEIGHT/MAP_HEIGHT;

export const ADJ_DIRS = [
    {x: -1, y: 0}, // left
    {x: 0, y: -1}, // up
    {x: 1, y: 0}, // right
    {x: 0, y: 1}, // down
];
export const DIA_DIRS = [
    {x: -1, y: -1}, // up left
    {x: 1, y: -1}, // up right
    {x: 1, y: 1}, // down right
    {x: -1, y: 1}, // down left
];
export const DIRS = [
    {x: -1, y: 0}, // left
    {x: -1, y: -1}, // up left
    {x: 0, y: -1}, // up
    {x: 1, y: -1}, // up right
    {x: 1, y: 0}, // right
    {x: 1, y: 1}, // down right
    {x: 0, y: 1}, // down
    {x: -1, y: 1}, // down left
];
export const WALL_LINES = [
    [[0, 0], [0, MAP_HEIGHT]],
    [[0, 0], [MAP_WIDTH, 0]],
    [[MAP_WIDTH, 0], [MAP_WIDTH, MAP_HEIGHT]],
    [[0, MAP_HEIGHT], [MAP_WIDTH, MAP_HEIGHT]],
];