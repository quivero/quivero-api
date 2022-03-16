import GraphVertex from '../../data-structures/graph/GraphVertex.js';

/**
 * @param {number[][]} adjacencyMatrix
 * @param {object} verticesIndices
 * @param {GraphVertex[]} cycle
 * @param {GraphVertex} vertexCandidate
 * @return {boolean}
 */
function isSafe(adjacencyMatrix, verticesKeystoIndices, cycle, vertexCandidate) {
  const endVertex = cycle[cycle.length - 1];

  // Get end and candidate vertices indices in adjacency matrix.
  const candidateVertexAdjacencyIndex = verticesKeystoIndices[vertexCandidate.getKey()];
  const endVertexAdjacencyIndex = verticesKeystoIndices[endVertex.getKey()];

  // Check if last vertex in the path and candidate vertex are adjacent.
  if (adjacencyMatrix[endVertexAdjacencyIndex][candidateVertexAdjacencyIndex] === Infinity) {
    return false;
  }

  // Check if vertexCandidate is being added to the path for the first time.
  const candidateDuplicate = cycle.find((vertex) => vertex.getKey() === vertexCandidate.getKey());

  return !candidateDuplicate;
}

/**
 * @param {number[][]} adjacencyMatrix
 * @param {object} verticesIndices
 * @param {GraphVertex[]} cycle
 * @return {boolean}
 */
function isCycle(adjacencyMatrix, verticesKeystoIndices, cycle) {
  // Check if first and last vertices in hamiltonian path are adjacent.

  // Get start and end vertices from the path.
  const startVertex = cycle[0];
  const endVertex = cycle[cycle.length - 1];

  // Get start/end vertices indices in adjacency matrix.
  const startVertexAdjacencyIndex = verticesKeystoIndices[startVertex.getKey()];
  const endVertexAdjacencyIndex = verticesKeystoIndices[endVertex.getKey()];

  // Check if we can go from end vertex to the start one.
  return adjacencyMatrix[endVertexAdjacencyIndex][startVertexAdjacencyIndex] !== Infinity;
}

/**
 * @param {number[][]} adjacencyMatrix
 * @param {GraphVertex[]} vertices
 * @param {object} verticesIndices
 * @param {GraphVertex[][]} cycles
 * @param {GraphVertex[]} cycle
 */
function* hamiltonianCycleRecursive({
  adjacencyMatrix,
  vertices,
  verticesKeystoIndices,
  cycle,
}) {
  // Clone cycle in order to prevent it from modification by other DFS branches.
  const currentCycle = [...cycle].map((vertex) => new GraphVertex(vertex.value));

  if (vertices.length === currentCycle.length) {
    // Hamiltonian path is found.
    // Now we need to check if it is cycle or not.
    if (isCycle(adjacencyMatrix, verticesKeystoIndices, currentCycle)) {
      // Another solution has been found. Save it.
      yield currentCycle;
    }
    return;
  }

  for (let vertexIndex = 0; vertexIndex < vertices.length; vertexIndex += 1) {
    // Get vertex candidate that we will try to put into next path step and see if it fits.
    const vertexCandidate = vertices[vertexIndex];

    // Check if it is safe to put vertex candidate to cycle.
    if (isSafe(adjacencyMatrix, verticesKeystoIndices, currentCycle, vertexCandidate)) {
      // Add candidate vertex to cycle path.
      currentCycle.push(vertexCandidate);

      // Try to find other vertices in cycle.
      for (
        const cycle_ of
        hamiltonianCycleRecursive({
          adjacencyMatrix,
          vertices,
          verticesKeystoIndices,
          cycle: currentCycle,
        })
      ) {
        yield cycle_;
      }

      // BACKTRACKING.
      // Remove candidate vertex from cycle path in order to try another one.
      currentCycle.pop();
    }
  }
}

/**
 * @param {Graph} graph
 * @return {GraphVertex[][]}
 */
export default function* hamiltonianCycle(graph) {
  // Gather some information about the graph that we will need to during
  // the problem solving.
  const verticesKeystoIndices = graph.getVerticesKeystoIndices();
  const adjacencyMatrix = graph.getAdjacencyMatrix();
  const vertices = graph.getAllVertices();

  // Define start vertex. We will always pick the first one
  // this it doesn't matter which vertex to pick in a cycle.
  // Every vertex is in a cycle so we can start from any of them.
  const startVertex = vertices[0];

  // Init cycles array that will hold all solutions.
  const cycles = [];

  // Init cycle array that will hold current cycle path.
  const cycle = [startVertex];

  // Try to find cycles recursively in Depth First Search order.
  for (const cycle_ of
    hamiltonianCycleRecursive({
      adjacencyMatrix,
      vertices,
      verticesKeystoIndices,
      cycles,
      cycle,
    })) {
    yield cycle_;
  }
}
