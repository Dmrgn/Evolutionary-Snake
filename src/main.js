import brain from 'brain.js';
import r from 'raylib'
import fs from 'fs';

import { Cell } from './cell.js';
import { CELL_HEIGHT, CELL_NETWORK_CONFIG, CELL_WIDTH, NUM_STARTING_CELLS, SCREEN_HEIGHT, SCREEN_WIDTH, SELECTION_TIMER, SIMULATION_SPEED } from './constants.js';
import { RightCell } from './rightCell.js';
import { LeftCell } from './leftCell.js';
import { CenterCell } from './centerCell.js';

let frameCount = 0;
let gen = 0;
let deaths = 0;
let cellCounts = {"left": 0, "right": 0, "center": 0};

// init cells
export let cellMap = []; // [y][x]
for (let i = 0; i < CELL_WIDTH; i++) {
    cellMap.push([]);
    for (let j = 0; j < CELL_HEIGHT; j++) {
        cellMap[i].push(0);
    }
}
export let cells = [];
for (let i = 0; i < NUM_STARTING_CELLS; i++) {
    const randX = Math.floor(Math.random() * CELL_WIDTH);
    const randY = Math.floor(Math.random() * CELL_HEIGHT);
    switch (Math.floor(Math.random() * 3)) {
        case 0:
            cells.push(new RightCell(randX, randY));
            break;
        case 1:
            cells.push(new LeftCell(randX, randY));
            break;
        case 2:
            cells.push(new CenterCell(randX, randY));
            break;
    }
    cellMap[randY][randX] = 1;
}
export let survivingCells = [];

// start drawing loop
r.InitWindow(SCREEN_WIDTH, SCREEN_HEIGHT, "Genetic Simulation")
r.SetTargetFPS(SIMULATION_SPEED*r.GetMouseX()/SCREEN_WIDTH);
while (!r.WindowShouldClose()) {
    frameCount++;
    r.BeginDrawing();
    r.ClearBackground(r.GRAY);

    if (frameCount%SELECTION_TIMER === 0) {
        survivingCells = [];
        cellCounts = {"left": 0, "right": 0, "center": 0};
        gen++;
        if (r.GetMouseX() < SCREEN_WIDTH/2)
            r.SetTargetFPS(2);
    } else {
        r.SetTargetFPS(SIMULATION_SPEED*r.GetMouseX()/SCREEN_WIDTH);
    }
    cells.forEach((cell, i)=>{
        cell.update(i);
        cell.draw(r);
        if (frameCount%SELECTION_TIMER === 0)
            cell.select();
    });
    if (frameCount%SELECTION_TIMER === 0) {
        cells = [];
        cellMap = []; // [y][x]
        for (let i = 0; i < CELL_WIDTH; i++) {
            cellMap.push([]);
            for (let j = 0; j < CELL_HEIGHT; j++) {
                cellMap[i].push(0);
            }
        }
        if (survivingCells.length === 0) {
            for (let i = 0; i < NUM_STARTING_CELLS; i++) {
                const randX = Math.floor(Math.random() * CELL_WIDTH);
                const randY = Math.floor(Math.random() * CELL_HEIGHT);
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        cells.push(new RightCell(randX, randY));
                        break;
                    case 1:
                        cells.push(new LeftCell(randX, randY));
                        break;
                    case 2:
                        cells.push(new CenterCell(randX, randY));
                        break;
                }
                cellMap[randY][randX] = 1;
            }
        } else {
            deaths = NUM_STARTING_CELLS-survivingCells.length;
            for (let i = 0; i < NUM_STARTING_CELLS-survivingCells.length; i++) {
                const randX = Math.floor(Math.random() * CELL_WIDTH);
                const randY = Math.floor(Math.random() * CELL_HEIGHT);
                const randomSurvivingIndex = Math.floor(Math.random() * survivingCells.length);
                if (survivingCells[randomSurvivingIndex].type === "left") {
                    cells.push(new LeftCell(randX, randY, survivingCells[randomSurvivingIndex]));
                } else if (survivingCells[randomSurvivingIndex].type === "right") {
                    cells.push(new RightCell(randX, randY, survivingCells[randomSurvivingIndex]));
                } else if (survivingCells[randomSurvivingIndex].type === "center") {
                    cells.push(new CenterCell(randX, randY, survivingCells[randomSurvivingIndex]));
                }
                cellCounts[survivingCells[randomSurvivingIndex].type]++;
            }
            for (let i = 0; i < survivingCells.length; i++) {
                survivingCells[i].pos.x = Math.floor(Math.random() * CELL_WIDTH);
                survivingCells[i].pos.y = Math.floor(Math.random() * CELL_HEIGHT);
                cells.push(survivingCells[i]);
                cellCounts[survivingCells[i].type]++;
            }
        }
        survivingCells = [];
        r.DrawRectangle(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, r.ColorAlpha(r.BLACK, 0.2));
    }

    r.DrawText(""+frameCount%SELECTION_TIMER, 10, 60, 40, r.BLACK);
    r.DrawText("Gen:"+gen, 10, 120, 40, r.BLACK);
    r.DrawText("Deaths:"+deaths, 10, 180, 40, r.BLACK);
    r.DrawText("Red (Left):"+cellCounts["left"], 10, SCREEN_HEIGHT-60, 20, r.RED);
    r.DrawText("Blue (Center):"+cellCounts["center"], SCREEN_WIDTH/2-80, SCREEN_HEIGHT-60, 20, r.BLUE);
    r.DrawText("Green (Right):"+cellCounts["right"], SCREEN_WIDTH-200, SCREEN_HEIGHT-60, 20, r.GREEN);
    r.DrawFPS(10, 10);

    r.EndDrawing();
}
r.CloseWindow();