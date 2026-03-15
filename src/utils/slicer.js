export function sliceVertices(vertices, layerHeight = 0.2) {
  const layers = new Map();

  for (let i = 0; i < vertices.length; i += 9) {
    const v1 = { x: vertices[i], y: vertices[i + 1], z: vertices[i + 2] };
    const v2 = {
      x: vertices[i + 3],
      y: vertices[i + 4],
      z: vertices[i + 5],
    };
    const v3 = {
      x: vertices[i + 6],
      y: vertices[i + 7],
      z: vertices[i + 8],
    };

    const minZ = Math.min(v1.z, v2.z, v3.z);
    const maxZ = Math.max(v1.z, v2.z, v3.z);

    const startLayer = Math.floor(minZ / layerHeight);
    const endLayer = Math.floor(maxZ / layerHeight);

    for (let layer = startLayer; layer <= endLayer; layer++) {
      const planeZ = layer * layerHeight;

      const points = [];

      intersectEdge(v1, v2, planeZ, points);
      intersectEdge(v2, v3, planeZ, points);
      intersectEdge(v3, v1, planeZ, points);

      if (points.length === 2) {
        if (!layers.has(layer)) {
          layers.set(layer, []);
        }

        layers.get(layer).push(points);
      }
    }
  }

  return layers;
}

function intersectEdge(v1, v2, planeZ, points) {
  if ((v1.z < planeZ && v2.z > planeZ) || (v1.z > planeZ && v2.z < planeZ)) {
    const t = (planeZ - v1.z) / (v2.z - v1.z);

    const x = v1.x + t * (v2.x - v1.x);
    const y = v1.y + t * (v2.y - v1.y);

    points.push({ x, y });
  }
}
