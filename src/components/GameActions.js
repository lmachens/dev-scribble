import React, { useCallback } from "react";
import Button from "./Button";
import styled from "@emotion/styled";
import { useSocket } from "../contexts/socket";

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
`;

function GameActions({ game, canClear }) {
  const socket = useSocket();

  const handleClearClick = useCallback(() => {
    socket.emit("clear canvas", game.gameId);
  }, [game.gameId, socket]);

  return (
    <Container>
      <Action onClick={handleClearClick} disabled={!canClear}>
        Clear
      </Action>
    </Container>
  );
}

export default GameActions;
