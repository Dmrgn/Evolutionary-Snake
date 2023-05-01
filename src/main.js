import r from 'raylib';
import fs from 'fs';
import path from 'path';
import brain from 'brain.js';

import { Snake } from './snake.js';
import { SCREEN_WIDTH, SCREEN_HEIGHT, NUM_ALPHA_SNAKES, NUM_SNAKES, SAVE_EVERY_N_GENERATIONS, FAST_FRAME_RATE, SAVE_FILE_NAME, SLOW_FRAME_RATE, MAX_GENERATION_DURATION } from './constants.js';
const NETWORK_DATA = JSON.parse(fs.readFileSync(path.resolve("./server/src/data/snake.json")));

let snakes = [];
let stillAlive = false;
let gen = 0;
let framesSinceLastGen = 0;
let topScore = 0;
let avgScore = 0;

export function prolongGen() {
    framesSinceLastGen = 0;
}

// init snakes
for (let i = 0; i < NUM_SNAKES; i++) {
    snakes.push(new Snake({network:new brain.NeuralNetwork(Snake.config).fromJSON(NETWORK_DATA)}));
}

// start drawing loop
r.InitWindow(SCREEN_WIDTH, SCREEN_HEIGHT, "Snake Sim")
r.SetTargetFPS(FAST_FRAME_RATE);
while (!r.WindowShouldClose()) {
    r.BeginDrawing();
    r.ClearBackground(r.GRAY);

    // update snakes
    stillAlive = false;
    let hasShown = false;
    for (let i = 0; i < snakes.length; i++) {
        if (!snakes[i].isDead) {
            stillAlive = true;
            snakes[i].update(!hasShown);
            if (!hasShown) {
                snakes[i].draw();
                hasShown = true;
            }
        }
    }

    // check if gen is over
    if (!stillAlive || framesSinceLastGen > MAX_GENERATION_DURATION) {
        // sort snakes by score
        snakes.sort(Snake.snakeSorter);
        if (snakes[0].score > topScore) topScore = snakes[0].score;
        avgScore = 0;
        snakes.forEach((snake)=>{
            avgScore+=snake.score;
        });
        avgScore/= NUM_SNAKES;
        // separate top n snakes
        let alphas = [];
        for (let i = 0; i < NUM_ALPHA_SNAKES; i++)
            alphas.push(snakes.shift());
        // save top alpha to file every n generations
        if (gen%SAVE_EVERY_N_GENERATIONS === 0)
            fs.writeFileSync(SAVE_FILE_NAME, JSON.stringify(alphas[0].network.toJSON()));
        // create next generation
        snakes = [];
        for (let i = 0; i < NUM_SNAKES-NUM_ALPHA_SNAKES; i++) {
            snakes.push(new Snake(alphas[Math.floor(Math.random() * alphas.length)]));
        }
        // add back alphas
        for (let i = 0; i < NUM_ALPHA_SNAKES; i++) {
            snakes.push(alphas.shift().reset());
        }
        // increase gen number
        gen++;
        framesSinceLastGen = 0;
    }

    // set frame rate
    if (r.GetMouseX() > SCREEN_WIDTH/2) {
        r.SetTargetFPS(FAST_FRAME_RATE);
    } else {
        r.SetTargetFPS(SLOW_FRAME_RATE);
    }
    framesSinceLastGen++;

    // draw ui
    r.DrawFPS(10, 10);
    r.DrawText("Gen: " + gen, 10, 30, 50, r.BLACK);
    r.DrawText("Gen Frames: " + framesSinceLastGen, 10, 80, 50, r.BLACK);
    r.DrawText("Top Score: " + topScore, 10, 130, 50, r.BLACK);
    r.DrawText("Avg Score: " + avgScore, 10, 180, 50, r.BLACK);

    r.EndDrawing();
}
r.CloseWindow();