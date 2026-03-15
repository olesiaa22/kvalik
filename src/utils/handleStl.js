import StlReader from "./stl-reader/stl-reader";

export async function handleSTL(file) {
  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();

  const reader = new StlReader();
  const result = reader.read(arrayBuffer);

  console.log("read result", result);

  return result;
}
