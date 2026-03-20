import { mat4 } from "gl-matrix";

export function renderModel(canvas, vertices) {
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("WebGL not supported");
    return;
  }

  // ==========================
  // 1. Центрування моделі
  // ==========================
  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;

  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    minZ = Math.min(minZ, z);

    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    maxZ = Math.max(maxZ, z);
  }

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const centerZ = (minZ + maxZ) / 2;

  const centeredVertices = new Float32Array(vertices.length);

  for (let i = 0; i < vertices.length; i += 3) {
    centeredVertices[i] = vertices[i] - centerX;
    centeredVertices[i + 1] = vertices[i + 1] - centerY;
    centeredVertices[i + 2] = vertices[i + 2] - centerZ;
  }

  // ==========================
  // 2. Shaders
  // ==========================
  const vsSource = `
    attribute vec3 aPosition;
    uniform mat4 uMatrix;

    void main() {
      gl_Position = uMatrix * vec4(aPosition, 1.0);
    }
  `;

  const fsSource = `
    precision mediump float;

    void main() {
      gl_FragColor = vec4(0.2, 0.6, 1.0, 1.0);
    }
  `;

  function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  // ==========================
  // 3. Buffer
  // ==========================
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, centeredVertices, gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  // ==========================
  // 4. Матриці
  // ==========================
  const projection = mat4.create();
  const view = mat4.create();
  const model = mat4.create();
  const mvp = mat4.create();

  mat4.perspective(
    projection,
    Math.PI / 4,
    canvas.width / canvas.height,
    0.1,
    1000,
  );

  mat4.translate(view, view, [0, 0, -200]);

  const matrixLocation = gl.getUniformLocation(program, "uMatrix");

  let rotationX = 0;
  let rotationY = 0;

  // ==========================
  // 5. Обертання мишею
  // ==========================
  let isDragging = false;
  let lastX, lastY;

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    rotationY += dx * 0.01;
    rotationX += dy * 0.01;

    lastX = e.clientX;
    lastY = e.clientY;

    drawScene();
  });

  // ==========================
  // 6. Малювання
  // ==========================
  function drawScene() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.95, 0.95, 0.95, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    mat4.identity(model);
    mat4.rotateX(model, model, rotationX);
    mat4.rotateY(model, model, rotationY);

    mat4.multiply(mvp, projection, view);
    mat4.multiply(mvp, mvp, model);

    gl.uniformMatrix4fv(matrixLocation, false, mvp);

    gl.drawArrays(gl.TRIANGLES, 0, centeredVertices.length / 3);
  }

  drawScene();
}
