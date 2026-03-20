import { useEffect, useRef } from "react";
import { renderModel } from "../../utils";

const Scene = ({ vertices }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    renderModel(canvasRef.current, vertices);
  });

  return (
    <canvas
      ref={canvasRef}
      id="glcanvas"
      style={{ width: "100%", height: 500 }}
      className="border border-gray-700"
    />
  );
};

export { Scene };
