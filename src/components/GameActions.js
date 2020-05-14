import React, { useCallback, useState } from "react";
import Button from "./Button";
import styled from "@emotion/styled";
import { useSocket } from "../contexts/socket";
import DangerIcon from "./DangerIcon";
import BrushSize, { sizes } from "./BrushSize";

const Container = styled.div`
  display: flex;
  border: 1px solid #2f363d;
  border-bottom: none;
  justify-content: flex-end;
`;

const Action = styled(Button)`
  font-size: 0.8rem;
  padding: 4px 8px;
  border: none;
  border-left: 1px solid #2f363d;
  background: ${(props) => (props.active ? "#2f363d" : "inherit")};
  :disabled {
    border-color: inherit;
  }
`;

const Grow = styled.div`
  flex-grow: 1;
`;

function GameActions({ game, isDrawing, brushSize, onBrushSize }) {
  const socket = useSocket();

  const handleClearClick = useCallback(() => {
    socket.emit("clear canvas", game.gameId);
  }, [game.gameId, socket]);

  const handleDistractClick = useCallback(() => {
    socket.emit("distract others", game.gameId);
  }, [game.gameId, socket]);

  return (
    <Container>
      {Object.keys(sizes).map((size) => (
        <Action
          key={size}
          active={brushSize === size}
          onClick={() => onBrushSize(size)}
        >
          <BrushSize size={size} />
        </Action>
      ))}

      <Grow />
      <Action
        onClick={handleDistractClick}
        disabled={isDrawing || !game.distractPossible}
      >
        <DangerIcon /> Distract <DangerIcon />
      </Action>
      <Action onClick={handleClearClick} disabled={!isDrawing}>
        Clear
      </Action>
    </Container>
  );
}

export default GameActions;
