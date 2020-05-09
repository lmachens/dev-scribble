import React from "react";
import GuessInput from "./GuessInput";
import styled from "@emotion/styled";
import PlayerName from "./PlayerName";

const Container = styled.div`
  margin-bottom: 10px;
`;

function GameActions({ game, isNextPlayer, secret, onGuessSubmit }) {
  return (
    <Container>
      {game.isRunning ? (
        <span>
          {isNextPlayer ? (
            secret
          ) : (
            <GuessInput
              onSubmit={onGuessSubmit}
              secretLength={game.nextSecretLength}
              round={game.round}
            />
          )}
        </span>
      ) : (
        <span>
          Waiting for <PlayerName>{game.owner.name}</PlayerName> to start...
        </span>
      )}
    </Container>
  );
}

export default GameActions;
