import React from "react";
import GuessInput from "./GuessInput";
import styled from "@emotion/styled";
import PlayerName from "./PlayerName";

const Container = styled.div`
  margin-bottom: 10px;
`;

const Round = styled.div`
  font-weight: bold;
`;

function GameActions({
  game,
  isNextPlayer,
  secret,
  onGuessSubmit,
  correctAnswer,
  timeLeft,
  secretHints,
}) {
  return (
    <Container>
      {game.isRunning && (
        <Round>
          Round {game.round}:{" "}
          <span>
            {game.oldSecret
              ? `${game.nextPlayer.name.toUpperCase()} is next`
              : `${timeLeft}s`}
          </span>
        </Round>
      )}
      {correctAnswer && "Your answer is correct"}
      {!correctAnswer && game.isRunning && (
        <span>
          {isNextPlayer || game.oldSecret ? (
            game.oldSecret || secret
          ) : (
            <GuessInput
              onSubmit={onGuessSubmit}
              secretLength={game.nextSecretLength}
              round={game.round}
              secretHints={secretHints}
            />
          )}
        </span>
      )}
      {!correctAnswer && !game.isRunning && (
        <span>
          Waiting for <PlayerName>{game.owner.name}</PlayerName> to start...
        </span>
      )}
    </Container>
  );
}

export default GameActions;
