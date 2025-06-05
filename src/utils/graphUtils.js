// src/utils/graphUtils.js
import * as THREE from "three";

export function calculateDistance(pos1, pos2) {
  if (!pos1 || !pos2) {
    // console.error("calculateDistance received invalid positions:", pos1, pos2);
    return Infinity;
  }
  const p1 = new THREE.Vector3(...pos1);
  const p2 = new THREE.Vector3(...pos2);
  return p1.distanceTo(p2);
}

export function buildWeightedGraph(connections, coordinates) {
  const weightedGraph = {};
  for (const node in connections) {
    if (!weightedGraph[node]) {
      weightedGraph[node] = {};
    }
    for (const neighbor of connections[node]) {
      if (coordinates[node] && coordinates[neighbor]) {
        const distance = calculateDistance(
          coordinates[node],
          coordinates[neighbor]
        );
        weightedGraph[node][neighbor] = distance;
        if (!weightedGraph[neighbor]) {
          weightedGraph[neighbor] = {};
        }
        if (coordinates[neighbor] && !weightedGraph[neighbor][node]) {
          weightedGraph[neighbor][node] = distance;
        }
      } else {
        // console.warn(
        //   `Skipping connection from ${node} to ${neighbor}: Missing coordinates or invalid connection.`
        // );
      }
    }
  }
  for (const node in coordinates) {
    if (!weightedGraph[node]) {
      weightedGraph[node] = {};
    }
  }
  return weightedGraph;
}

export function findNearestRoadNode(position, roadNodes) {
  if (!position) return null;

  let nearestNode = null;
  let minDistance = Infinity;
  const positionVector = new THREE.Vector3(...position);

  for (const nodeId in roadNodes) {
    const nodePosition = roadNodes[nodeId];
    if (nodePosition) {
      const distance = positionVector.distanceTo(
        new THREE.Vector3(...nodePosition)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestNode = nodeId;
      }
    }
  }
  return nearestNode;
}

export class PriorityQueue {
  constructor() {
    this.elements = [];
  }
  enqueue(element, priority) {
    this.elements.push({ element, priority });
    this.bubbleUp(this.elements.length - 1);
  }
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    this.swap(0, this.elements.length - 1);
    const element = this.elements.pop();
    this.bubbleDown(0);
    return element;
  }
  isEmpty() {
    return this.elements.length === 0;
  }
  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }
  getLeftChildIndex(i) {
    return 2 * i + 1;
  }
  getRightChildIndex(i) {
    return 2 * i + 2;
  }
  swap(i1, i2) {
    [this.elements[i1], this.elements[i2]] = [
      this.elements[i2],
      this.elements[i1],
    ];
  }
  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.elements[parentIndex].priority > this.elements[index].priority) {
        this.swap(parentIndex, index);
        index = parentIndex;
      } else {
        break;
      }
    }
  }
  bubbleDown(index) {
    const leftChildIndex = this.getLeftChildIndex(index);
    const rightChildIndex = this.getRightChildIndex(index);
    let smallestIndex = index;
    if (
      leftChildIndex < this.elements.length &&
      this.elements[leftChildIndex].priority <
        this.elements[smallestIndex].priority
    ) {
      smallestIndex = leftChildIndex;
    }
    if (
      rightChildIndex < this.elements.length &&
      this.elements[rightChildIndex].priority <
        this.elements[smallestIndex].priority
    ) {
      smallestIndex = rightChildIndex;
    }
    if (smallestIndex !== index) {
      this.swap(index, smallestIndex);
      this.bubbleDown(smallestIndex);
    }
  }
}

export function dijkstra(graph, startNode, endNode) {
  const distances = {};
  const visited = new Set();
  const predecessors = {};
  const pq = new PriorityQueue();

  for (const node in graph) {
    distances[node] = Infinity;
    predecessors[node] = null;
  }

  if (!graph[startNode]) {
    // console.error(
    //   `Dijkstra: Start node "${startNode}" not found in the graph.`
    // );
    return null;
  }
  if (!graph[endNode]) {
    // console.error(`Dijkstra: End node "${endNode}" not found in the graph.`);
    return null;
  }

  distances[startNode] = 0;
  pq.enqueue(startNode, 0);

  while (!pq.isEmpty()) {
    const { element: currentNode, priority: currentDistance } = pq.dequeue();

    if (visited.has(currentNode)) {
      continue;
    }
    visited.add(currentNode);

    if (currentNode === endNode) {
      const path = [];
      let step = endNode;
      while (step) {
        path.unshift(step);
        step = predecessors[step];
      }
      return path;
    }

    const neighbors = graph[currentNode];
    if (neighbors) {
      for (const neighbor in neighbors) {
        const weight = neighbors[neighbor];
        const distance = currentDistance + weight;

        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          predecessors[neighbor] = currentNode;
          pq.enqueue(neighbor, distance);
        }
      }
    }
  }
  return null;
}