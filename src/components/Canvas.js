import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "@emotion/styled";
import { sizes } from "./BrushSize";

const MaxCanvas = styled.canvas`
  max-width: 100%;
`;

function calcDrawPosition(event, canvas) {
  return [
    ((event.pageX - canvas.parentElement.offsetLeft) * canvas.width) /
      canvas.parentElement.offsetWidth +
      1,
    ((event.pageY - canvas.parentElement.offsetTop) * canvas.height) /
      canvas.parentElement.offsetHeight +
      1,
  ];
}

function Canvas({
  onChange,
  drawOperation,
  oldDrawOperations,
  color,
  disabled,
  redrawTimestamp,
  brushSize,
}) {
  const canvasRef = useRef();
  const [previous, setPrevious] = useState(null);
  const [current, setCurrent] = useState(null);
  const [drawing, setDrawing] = useState(false);

  const paint = useCallback((drawOperation) => {
    const ctx = canvasRef.current.getContext("2d");

    ctx.strokeStyle = drawOperation.color;
    ctx.lineWidth = sizes[drawOperation.brushSize];
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(drawOperation.previous[0], drawOperation.previous[1]);
    ctx.lineTo(drawOperation.current[0], drawOperation.current[1]);
    ctx.stroke();
    ctx.closePath();
  }, []);

  const handleMouseUp = useCallback(() => {
    setDrawing(false);
    setCurrent(null);
    setPrevious(null);
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      if (!drawing) {
        return;
      }
      const drawPosition = calcDrawPosition(event, canvasRef.current);
      setPrevious(current);
      setCurrent(drawPosition);
    },
    [drawing, current]
  );

  const handleTouchEnd = useCallback(
    (event) => {
      handleMouseUp();
    },
    [handleMouseUp]
  );

  const handleTouchMove = useCallback(
    (event) => {
      if (!drawing) {
        return;
      }
      const touch = event.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      handleMouseMove(mouseEvent);
    },
    [drawing, handleMouseMove]
  );

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchEnd", handleTouchEnd);
    window.addEventListener("touchMove", handleTouchMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchEnd", handleTouchEnd);
      window.removeEventListener("touchMove", handleTouchMove);
    };
  }, [handleMouseUp, handleMouseMove, handleTouchEnd, handleTouchMove]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, [redrawTimestamp]);

  useEffect(() => {
    if (oldDrawOperations) {
      oldDrawOperations.forEach(paint);
    }
  }, [oldDrawOperations, paint]);

  useEffect(() => {
    if (!drawing || disabled || !previous || !current) {
      return;
    }
    const drawOperation = {
      previous,
      current,
      color,
      brushSize: brushSize,
    };
    paint(drawOperation);
    onChange(drawOperation);
  }, [onChange, drawing, previous, current, color, disabled, paint, brushSize]);

  useEffect(() => {
    if (!drawOperation) {
      return;
    }
    paint(drawOperation);
  }, [drawOperation, paint]);

  const handleMouseDown = useCallback((event) => {
    const drawPosition = calcDrawPosition(event, canvasRef.current);
    setCurrent(drawPosition);
    setDrawing(true);
  }, []);

  const handleTouchStart = useCallback(
    (event) => {
      const touch = event.touches[0];
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      handleMouseDown(mouseEvent);
    },
    [handleMouseDown]
  );

  return (
    <MaxCanvas
      ref={canvasRef}
      width="800"
      height="600"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    />
  );
}

export default Canvas;
