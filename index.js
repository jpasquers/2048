"use strict";
const NEAT = require("pasquej-neat");

let fitnessFn = (graph) => {
    return graph.nodes.length;
}

let neat = new NEAT.NEAT(5,5,fitnessFn);
neat.execute();