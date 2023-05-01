import brain from 'brain.js';

import { shortestDistanceIntersectionOfPointsAndLine } from '../../src/inputs.js';
import { ADJ_DIRS, DIRS, MAP_HEIGHT, MAP_WIDTH } from '../../src/constants.js';

export class Game {
    static config = {
        binaryThresh: 0.5, // ¯\_(ツ)_/¯
        activation: 'sigmoid',
        inputSize: 18,
        hiddenLayers: [16, 16],
        outputSize: 4,
    };
    network = null;
    pos = null;
    food = null;
    tail = null;
    id = null;

    constructor(networkData, boardData, snakeData) {
        this.network = new brain.NeuralNetwork(Game.config);
        this.network.fromJSON(networkData);
        this.id = snakeData.id;
        this.consumeBoardData(boardData, snakeData);
    }
    consumeBoardData(boardData, snakeData) {
        // set info about this snake
        this.tail = [...snakeData.body.slice(1, snakeData.body.length)];
        this.pos = snakeData.head;
        // set info about the board
        this.food = boardData.food;
    }
    doesMoveKillMe(moveIndex) {
        const newX = this.pos.x + ADJ_DIRS[moveIndex].x;
        const newY = this.pos.y + ADJ_DIRS[moveIndex].y;
        if (newX >= MAP_WIDTH || newX < 0 || newY >= MAP_HEIGHT || newY < 0) {
            return true;
        }
        for (const piece of this.tail) {
            if (piece.x === newX && piece.y === newY) {
                return true;
            }
        }
        return false;
    }
    move() {
        // create inputs
        let inputs = [];
        DIRS.forEach((dir)=>{
            const line = [[this.pos.x+dir.x+0.5, this.pos.y+dir.y+0.5], [this.pos.x+dir.x*MAP_WIDTH+0.5, this.pos.y+dir.y*MAP_HEIGHT+0.5]];
            // check intersection with each food, tail piece
            inputs.push(shortestDistanceIntersectionOfPointsAndLine(this.food, line));
            inputs.push(shortestDistanceIntersectionOfPointsAndLine(this.tail, line));
        });
        inputs.push(this.pos.x/MAP_WIDTH, this.pos.y/MAP_HEIGHT);

        // get output
        let guess = this.network.run(inputs);
        let choice = null;
        for (let i = 0; i < guess.length; i++) {
            let best = guess.indexOf(Math.max(...guess));
            if (!this.doesMoveKillMe(best)) {
                choice = best;
                break;
            }
            guess[best] = Number.MIN_SAFE_INTEGER;
        }

        // we're screwed sadge
        if (choice === null) {
            console.log("No choice but to accept my fate");
            return "up";
        }

        switch (choice) { 
            // looks like y values are inverted, so up and 
            // down here are flipped compared to what it 
            // was trained on: (0, 0) is bottom left
            case 0:
                return "left";
            case 1:
                return "down";
            case 2:
                return "right";
            case 3:
                return "up";
        }
    }
}

// {
//     height: 11,
//     width: 11,
//     snakes: [
//       {
//         id: 'gs_v4WV8F4bQdgJTSxP68H3rMB6',
//         name: 'snake',
//         latency: '',
//         health: 100,
//         body: [Array],
//         head: [Object],
//         length: 3,
//         shout: '',
//         squad: '',
//         customizations: [Object]
//       }
//     ],
//     food: [ { x: 4, y: 0 }, { x: 5, y: 5 } ],
//     hazards: []
// }

// {
//     id: 'gs_v4WV8F4bQdgJTSxP68H3rMB6',
//     name: 'snake',
//     latency: '',
//     health: 100,
//     body: [ { x: 5, y: 1 }, { x: 5, y: 1 }, { x: 5, y: 1 } ],
//     head: { x: 5, y: 1 },
//     length: 3,
//     shout: '',
//     squad: '',
//     customizations: { color: '#ff0000', head: 'default', tail: 'default' }
// }