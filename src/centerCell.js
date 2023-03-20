import r from 'raylib';

import { CELL_DRAW_HEIGHT, CELL_DRAW_WIDTH, CELL_HEIGHT, CELL_MUTATION_AMOUNT, CELL_NETWORK_CONFIG, CELL_STARTING_FOOD_AMOUNT, CELL_WIDTH, DIRS } from "./constants.js";
import { Cell } from "./cell.js";
import { cellMap, cells, survivingCells } from './main.js';

export class CenterCell extends Cell {
    type = "center";
    select() { // add or omit self to surviving array
        if (this.pos.x > CELL_WIDTH/4 && this.pos.x < CELL_WIDTH*3/4) {
            survivingCells.push(this);
        }
    }
    draw() {
        r.DrawRectangle(this.pos.x*CELL_DRAW_WIDTH, this.pos.y*CELL_DRAW_HEIGHT, CELL_DRAW_WIDTH, CELL_DRAW_HEIGHT, r.BLUE);
    }
}