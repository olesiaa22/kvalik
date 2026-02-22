import "./style.css";
import StlReader from "./stl-reader/stl-reader.js";
import { renderModel } from "./renderer.js";

// consts
const fileInput = document.querySelector(
  '#coordinates-form input[type="file"]',
);
const canvas = document.getElementById("canvas2d");
const ctx = canvas.getContext("2d");
// 3D draw
const canvas3D = document.getElementById("glcanvas");
const gl = canvas3D.getContext("webgl");

if (!gl) {
  alert("WebGL не підтримується");
}

// draw 2D object
function drawMesh2D(vertices) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < vertices.length; i += 9) {
    const x1 = vertices[i];
    const y1 = vertices[i + 1];

    const x2 = vertices[i + 3];
    const y2 = vertices[i + 4];

    const x3 = vertices[i + 6];
    const y3 = vertices[i + 7];

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();

    ctx.strokeStyle = "blue";
    ctx.stroke();
  }
}

// hanlde STL file uploading
fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();

  const reader = new StlReader();
  const result = reader.read(arrayBuffer);

  // 2D
  drawMesh2D(result.vertices);

  // 3D
  renderModel(canvas3D, result.vertices);

  console.log(result);
});
