import brain from 'brain.js';
import r from 'raylib';

import { CELL_DRAW_HEIGHT, CELL_DRAW_WIDTH, CELL_HEIGHT, CELL_MUTATION_AMOUNT, CELL_NETWORK_CONFIG, CELL_STARTING_FOOD_AMOUNT, CELL_WIDTH, DIRS } from "./constants.js";
import { cellMap, cells, survivingCells } from './main.js';

/*

Enough food -> reproduce


*/

export class Cell {
    food = null;
    id = null;
    pos = null;
    constructor (x, y, parent) {
        this.food = CELL_STARTING_FOOD_AMOUNT;
        this.pos = {x:x, y:y};
        this.network = new brain.NeuralNetwork(CELL_NETWORK_CONFIG);
        this.network.initialize();
        if (parent !== undefined) {
            let networkJSON = parent.network.toJSON();
            for (let i = 0; i < CELL_MUTATION_AMOUNT; i++) {
                let layer = Math.floor(Math.random()*(networkJSON.layers.length-1))+1;
                let weightArrIndex = Math.floor(Math.random()*(networkJSON.layers[layer].weights.length));
                let weightIndex = Math.floor(Math.random()*(networkJSON.layers[layer].weights[weightArrIndex].length));
                networkJSON.layers[layer].weights[weightArrIndex][weightIndex] += Math.random()*2-1;
            }
            this.network.fromJSON(networkJSON);
        }
    }
    static wrapPos(pos) {
        let xmod = pos.x % CELL_WIDTH;
        let ymod = pos.y % CELL_HEIGHT;
        if (xmod < 0) xmod = CELL_WIDTH+xmod;
        if (ymod < 0) ymod = CELL_HEIGHT+ymod;
        return {x: xmod, y: ymod};
    }
    static randOf() { // random index within passed array bounds

    }
    move(dirIndex) {
        const {x: xmod, y: ymod} = Cell.wrapPos({x:this.pos.x+DIRS[dirIndex].x, y:this.pos.y+DIRS[dirIndex].y});
        if (cellMap[ymod][xmod] === 1) return;
        cellMap[this.pos.y][this.pos.x] = 0;
        cellMap[ymod][xmod] = 1;
        this.pos.x+=DIRS[dirIndex].x;
        this.pos.y+=DIRS[dirIndex].y;
        this.pos = Cell.wrapPos(this.pos);
    }
    select() {
        // should be overridden by subclasses to determine selection conditions for the cell
    }
    update(index) {
        // generate network inputs
        // neighbouring cells
        const inputs = DIRS.map((dir)=>{
            const {x: xmod, y: ymod} = Cell.wrapPos({x:this.pos.x+dir.x, y:this.pos.y+dir.y});
            return cellMap[ymod][xmod];
        });
        // normalized position
        // const inputs = [];
        inputs.push(this.pos.x/CELL_WIDTH, this.pos.y/CELL_HEIGHT);

        // generate network outputs
        const output = this.network.run(inputs);
        const action = output.indexOf(Math.max(...output));

        // perform action
        switch (action) {
            case 0: // move left
                this.move(0);
                break;
            case 1: // move up
                this.move(1);
                break;
            case 2: // move right
                this.move(2);
                break;
            case 3: // move down
                this.move(3);
                break;
            case 4: // move randomly
                this.move(Math.floor(Math.random()*4));
                break;
            default:
                console.log("hmm invalid action", action);
                break;
        }
    }
    draw() {
        // should be overridden by subclasses
    }
}