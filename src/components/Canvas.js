import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

const BorderCanvas = styled.canvas`
  border: 1px solid #2f363d;
  max-width: 100%;
`;

function calcDrawPosition(event, canvas) {
  return [
    ((event.clientX - canvas.offsetLeft) * canvas.width) / canvas.offsetWidth,
    ((event.clientY - canvas.offsetTop) * canvas.height) / canvas.offsetHeight,
  ];
}

function Canvas({
  onChange,
  drawOperation,
  oldDrawOperations,
  color,
  disabled,
  nextPlayer,
}) {
  const canvasRef = useRef();
  const [previous, setPrevious] = useState(null);
  const [current, setCurrent] = useState(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, [nextPlayer]);

  useEffect(() => {
    if (!drawing || disabled || !previous || !current) {
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
  }, [onChange, drawing, previous, current, color, disabled]);

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
    setCurrent(calcDrawPosition(event, canvasRef.current));
    setDrawing(true);
  }

  function handleMouseUp() {
    setDrawing(false);
    setCurrent(null);
  }

  function handleMouseMove(event) {
    setPrevious(current);
    setCurrent(calcDrawPosition(event, canvasRef.current));
  }

  function handleTouchStart(event) {
    const touch = event.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    handleMouseDown(mouseEvent);
  }

  function handleTouchEnd(event) {
    handleMouseUp();
  }

  function handleTouchMove(event) {
    const touch = event.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    handleMouseMove(mouseEvent);
  }

  return (
    <BorderCanvas
      ref={canvasRef}
      width="800"
      height="600"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    />
  );
}

export default Canvas;
