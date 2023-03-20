import r from 'raylib';

import { CELL_DRAW_HEIGHT, CELL_DRAW_WIDTH, CELL_HEIGHT, CELL_MUTATION_AMOUNT, CELL_NETWORK_CONFIG, CELL_STARTING_FOOD_AMOUNT, CELL_WIDTH, DIRS } from "./constants.js";
import { Cell } from "./cell.js";
import { cellMap, rightSurvivingCells } from './main.js';

export class RightCell extends Cell {
    type = "right";
    select() { // add or omit self to surviving array
        if (this.pos.x >= CELL_WIDTH/2) {
            rightSurvivingCells.push(this);
        }
    }
    draw() {
        r.DrawRectangle(this.pos.x*CELL_DRAW_WIDTH, this.pos.y*CELL_DRAW_HEIGHT, CELL_DRAW_WIDTH, CELL_DRAW_HEIGHT, r.GREEN);
    }
}