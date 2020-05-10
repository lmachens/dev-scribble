import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import Button from "./Button";

const BorderCanvas = styled.canvas`
  border: 1px solid #2f363d;
  max-width: 100%;
`;

const Actions = styled.div`
  display: flex;
  border: 1px solid #2f363d;
  border-bottom: none;
  justify-content: flex-end;
`;

const CanvasAction = styled(Button)`
  font-size: 0.8rem;
  padding: 4px 8px;
  border: none;
  border-left: 1px solid #2f363d;
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
  onClear,
  redrawTimestamp,
}) {
  const canvasRef = useRef();
  const [previous, setPrevious] = useState(null);
  const [current, setCurrent] = useState(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    oldDrawOperations.forEach(paint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextPlayer, redrawTimestamp]);

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
    setPrevious(null);
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
    <>
      <Actions>
        <CanvasAction onClick={onClear} disabled={disabled}>
          Clear
        </CanvasAction>
      </Actions>
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
    </>
  );
}

export default Canvas;
