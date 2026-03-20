export function gCodeGenerator(layers, layerHeight = 0.2) {
  const gcode = [];

  gcode.push("G21");
  gcode.push("G90");
  gcode.push("G28");

  for (const [layerIndex, segments] of layers) {
    const z = layerIndex * layerHeight;

    gcode.push(`; LAYER ${layerIndex}`);
    gcode.push(`G0 Z${z.toFixed(3)}`);

    for (const segment of segments) {
      const p1 = segment[0];
      const p2 = segment[1];

      gcode.push(`G0 X${p1.x.toFixed(3)} Y${p1.y.toFixed(3)}`);
      gcode.push(`G1 X${p2.x.toFixed(3)} Y${p2.y.toFixed(3)} F1500`);
    }
  }

  return gcode.join("\n");
}
