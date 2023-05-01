import express from 'express';
import fs from 'fs';
import path from 'path';

import { Game } from './game.js';

const app = express();
app.use(express.json());

const PORT = 2000;
const META_DATA = JSON.parse(fs.readFileSync(path.resolve("./server/src/data/meta.json")));
const NETWORK_DATA = JSON.parse(fs.readFileSync(path.resolve("./server/src/data/snake.json")));

let game = null;

app.get('/', (req, res) => {
    return res.json(META_DATA);
})

app.post('/start', (req, res) => {
    // create game with snake data
    game = new Game(NETWORK_DATA, req.body.board, req.body.you);
    return res.status(200);
})

app.post('/move', (req, res) => {
    game.consumeBoardData(req.body.board, req.body.you);
    const move = game.move();
    console.log(move);
    return res.json({
        "move": move,
        "shout": "Moving up!"
    });
})

app.post('/end', (req, res) => {
    return res.status(200);
})

app.listen(PORT, '0.0.0.0', function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})