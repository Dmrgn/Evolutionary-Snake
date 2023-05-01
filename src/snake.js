import brain from 'brain.js';
import r from 'raylib';

import { ADJ_DIRS, DIRS, MAP_HEIGHT, MAP_WIDTH, MAX_FRAMES_SINCE_FOOD, SNAKE_DRAW_HEIGHT, SNAKE_DRAW_WIDTH, SNAKE_MUTATION_AMOUNT, WALL_LINES } from './constants.js';
import { createEmptyMap, shortestDistanceIntersectionOfPointsAndLine } from './inputs.js';
import { prolongGen } from './main.js';

export class Snake {
    static config = {
        binaryThresh: 0.5, // ¯\_(ツ)_/¯
        activation: 'sigmoid',
        inputSize: 18, // distance to tail, food in each of 8 directions + current pos
        hiddenLayers: [16, 16],
        outputSize: 4,
    };
    network = null;
    pos = null;
    tail = null;
    food = null;
    score = null;
    isDead = null;
    framesSinceFood = null;

    constructor(parent) {
        this.network = new brain.NeuralNetwork(Snake.config);
        this.network.initialize();
        if (parent !== undefined) {
            let networkJSON = parent.network.toJSON();
            for (let i = 0; i < SNAKE_MUTATION_AMOUNT; i++) {
                let layer = Math.floor(Math.random()*(networkJSON.layers.length-1))+1;
                let weightArrIndex = Math.floor(Math.random()*(networkJSON.layers[layer].weights.length));
                let weightIndex = Math.floor(Math.random()*(networkJSON.layers[layer].weights[weightArrIndex].length));
                networkJSON.layers[layer].weights[weightArrIndex][weightIndex] += Math.random()*2-1;
            }
            this.network.fromJSON(networkJSON);
        }
        this.reset();
    }
    static snakeSorter(a, b) {
        return b.score - a.score;
    }
    placeFood() {
        let foodPos, isTouchingTail;
        do {
            foodPos = {
                x: Math.floor(Math.random() * MAP_WIDTH),
                y: Math.floor(Math.random() * MAP_HEIGHT),
            };
            isTouchingTail = false;
            for (const piece of this.tail) {
                if (foodPos.x === piece.x && foodPos.y === piece.y) {
                    isTouchingTail = true;
                    break;
                }
            }
        } while((foodPos.x === this.pos.x && foodPos.y === this.pos.y) || isTouchingTail);
        this.food.push(foodPos);
    }
    reset() {
        this.pos = {
            x: Math.floor(Math.random() * MAP_WIDTH),
            y: Math.floor(Math.random() * MAP_HEIGHT),
        };
        this.tail = [{x:this.pos.x, y:this.pos.y}, {x:this.pos.x, y:this.pos.y}];
        this.food = [];
        for (let i = 0; i < 3; i++)
            this.placeFood();
        this.score = 0;
        this.isDead = false;
        this.framesSinceFood = 0;
        return this;
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
    update(shouldDraw) {
        let inputs = [];
        DIRS.forEach((dir)=>{
            const line = [[this.pos.x+dir.x+0.5, this.pos.y+dir.y+0.5], [this.pos.x+dir.x*MAP_WIDTH+0.5, this.pos.y+dir.y*MAP_HEIGHT+0.5]];
            // check intersection with each food, tail piece
            inputs.push(shortestDistanceIntersectionOfPointsAndLine(this.food, line, shouldDraw));
            inputs.push(shortestDistanceIntersectionOfPointsAndLine(this.tail, line, shouldDraw));
        });
        inputs.push(this.pos.x/MAP_WIDTH, this.pos.y/MAP_HEIGHT);

        // get output
        let guess = this.network.run(inputs);
        let choice = null;
        let originalChoice = null;
        for (let i = 0; i < guess.length; i++) {
            let best = guess.indexOf(Math.max(...guess));
            if (i === 0) originalChoice = best;
            if (!this.doesMoveKillMe(best)) {
                choice = best;
                break;
            }
            guess[best] = Number.MIN_SAFE_INTEGER;
        }
        
        // train network to use the best choice
        if (choice !== originalChoice && choice !== null) {
            // let suggestedOutput = [];
            // for (let i = 0; i < guess.length; i++) suggestedOutput.push(guess[i]);
            // suggestedOutput[choice] = 1;
            guess[choice] = 1;
            // this.network.train([{input: inputs, output: [...guess]}], {iterations: 1});
        }

        // we're screwed sadge
        if (choice === null) {
            choice = 3;
        }

        // actually do what it was originally going to do
        choice = originalChoice;

        // move self and tail
        let dir = ADJ_DIRS[choice];
        let last = {x:this.tail[this.tail.length - 1].x, y:this.tail[this.tail.length - 1].y};
        for (let i = this.tail.length - 1; i > 0; i--) {
            this.tail[i].x = this.tail[i-1].x;
            this.tail[i].y = this.tail[i-1].y;
        }
        this.tail[0].x = this.pos.x;
        this.tail[0].y = this.pos.y;
        this.pos.x += dir.x;
        this.pos.y += dir.y;

        // check if dead
        if (this.pos.x >= MAP_WIDTH || this.pos.x < 0 || this.pos.y >= MAP_HEIGHT || this.pos.y < 0) {
            this.isDead = true;
            return;
        }
        this.tail.forEach((piece)=>{
            if (piece.x === this.pos.x && piece.y === this.pos.y) {
                this.isDead = true;
                return;
            }
        });

        // check if eating
        this.framesSinceFood++;
        if (this.framesSinceFood > MAX_FRAMES_SINCE_FOOD) {
            this.isDead = true;
            return;
        }
        for (let i = 0; i < this.food.length; i++) {
            if (this.pos.x === this.food[i].x && this.pos.y === this.food[i].y) {
                this.food.splice(i, 1);
                this.placeFood();
                this.tail.push(last); // add back last tail item
                prolongGen();
                this.score += 1;
                this.framesSinceFood = 0;
                break;
            }
        }
    }
    draw() {
        // draw self
        r.DrawRectangle(this.pos.x*SNAKE_DRAW_WIDTH, this.pos.y*SNAKE_DRAW_HEIGHT, SNAKE_DRAW_WIDTH, SNAKE_DRAW_HEIGHT, r.LIME);
        this.tail.forEach((piece)=>{
            r.DrawRectangle(piece.x*SNAKE_DRAW_WIDTH, piece.y*SNAKE_DRAW_HEIGHT, SNAKE_DRAW_WIDTH, SNAKE_DRAW_HEIGHT, r.GREEN);
        });
        // draw food
        this.food.forEach((piece)=>{
            r.DrawEllipse(piece.x*SNAKE_DRAW_WIDTH+SNAKE_DRAW_WIDTH/2, piece.y*SNAKE_DRAW_HEIGHT+SNAKE_DRAW_HEIGHT/2, SNAKE_DRAW_WIDTH/2, SNAKE_DRAW_HEIGHT/2, r.RED);
        });
    }
}