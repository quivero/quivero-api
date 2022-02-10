// [START app]
import express from 'express';
import { createRequire } from 'module';
import fs from 'fs';

import {
  startAndFinishNodes,
  nodeToLane,
  parseBlueprintToGraph,
  fromStartToFinishAcyclicPaths,
  fromStartToFinishCombsAcyclicPaths,
} from './utils/workflow/parsers.js';

const require = createRequire(import.meta.url);
const app = express();

// [START enable_parser]
// This middleware is available in Express v4.16.0 onwards
app.use(express.json({ extended: true }));
// [END enable_parser]

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

app.get('/', (req, res) => {
  // Driver program
  // Create a sample graph

  const bps_root = './samples/blueprints/';
  const blueprints_fnames = fs.readdirSync(bps_root);

  const READ_ALL_BPS = false;
  const blueprint_fname = 'precious.json';

  const graphs = [];
  const descriptions = [];

  if (READ_ALL_BPS) {
    for (let i = 0; i < blueprints_fnames.length; i++) {
      const fname = bps_root + blueprints_fnames[i];
      const blueprint_i = require(fname);
      
      // let graph_i = parseBlueprintToGraph(blueprint_i);
      descriptions.push(fromStartToFinishCombsAcyclicPaths(blueprint_i));
    }

    res.send(descriptions);
  } else {
    const fname = bps_root + blueprint_fname;
    const blueprint_i = require(fname);
    
    const graph = parseBlueprintToGraph(blueprint_i);
    const route_describe = fromStartToFinishCombsAcyclicPaths(blueprint_i);
    
    res.send(graph.getEulerianPath());
  }
});
// [END app]
