/* edit stuff below this line
 =================================================================
*/
// cell variables
export const SIMULATION_SPEED = 1000;
export const SELECTION_TIMER = 240;
export const NUM_STARTING_CELLS = 200;
export const CELL_STARTING_FOOD_AMOUNT = 10;
export const CELL_MUTATION_AMOUNT = 1;
// network config
export const CELL_NETWORK_CONFIG = {
    binaryThresh: 0.5,
    activation: 'sigmoid',
    inputSize: 6, // adjacent cells + normalized x + normalized y
    hiddenLayers: [4, 4], // abritrary
    outputSize: 5, // move to adjacent cells + random direction
};
// screen size
export const SCREEN_WIDTH = 800;
export const SCREEN_HEIGHT = 800;
export const CELL_WIDTH = 100;
export const CELL_HEIGHT = 100;
/* edit stuff above this line
 =================================================================
*/

// useful stuff
export const DIRS = [
    {x:-1, y:0}, // left
    {x:0, y:-1}, // up
    {x:1, y:0}, // right
    {x:0, y:1}, // down
];

// calculated constants
export const CELL_DRAW_WIDTH = SCREEN_WIDTH/CELL_WIDTH;
export const CELL_DRAW_HEIGHT = SCREEN_HEIGHT/CELL_HEIGHT;