import React, { useEffect, useRef, useState } from "react";

const colors = ["orange", "green", "red"];
const color = colors[Math.floor(Math.random() * colors.length)];
function Canvas({ onChange, drawOperation, oldDrawOperations }) {
  const canvasRef = useRef();
  const [previous, setPrevious] = useState(null);
  const [current, setCurrent] = useState(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (!drawing) {
      return;
    }

    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(previous[0], previous[1]);
    ctx.lineTo(current[0], current[1]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
    onChange({ previous, current, color });
  }, [onChange, drawing, previous, current]);

  useEffect(() => {
    if (oldDrawOperations.length === 0) {
      return;
    }

    oldDrawOperations.forEach(paint);
  }, [oldDrawOperations]);

  useEffect(() => {
    if (!drawOperation) {
      return;
    }
    paint(drawOperation);
  }, [drawOperation]);

  function paint(drawOperation) {
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(drawOperation.previous[0], drawOperation.previous[1]);
    ctx.lineTo(drawOperation.current[0], drawOperation.current[1]);
    ctx.strokeStyle = drawOperation.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }

  function handleMouseDown(event) {
    setCurrent([
      event.clientX - canvasRef.current.offsetLeft,
      event.clientY - canvasRef.current.offsetTop,
    ]);
    setDrawing(true);
  }

  function handleMouseUp(event) {
    setDrawing(false);
    setCurrent(null);
  }

  function handleMouseMove(event) {
    setPrevious(current);
    setCurrent([
      event.clientX - canvasRef.current.offsetLeft,
      event.clientY - canvasRef.current.offsetTop,
    ]);
  }

  return (
    <canvas
      ref={canvasRef}
      width="400"
      height="300"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    />
  );
}

export default Canvas;
