import React from "react";
import styled from "@emotion/styled";
import PlayerName from "./PlayerName";
import { css } from "@emotion/core";
import { scrollBackground, fadeAnimation, fadeOutAnimation } from "./styles";

function getStatusStyles({ isNextPlayer, correctAnswer }) {
  if (isNextPlayer) {
    return fadeAnimation;
  }
  if (correctAnswer) {
    return css`
      animation: ${scrollBackground} 100s linear infinite;
    `;
  }
}

const PlayerStatusName = styled(PlayerName)`
  ${getStatusStyles};
`;

const Container = styled.span`
  position: relative;
`;
const LastGuessing = styled.span`
  position: absolute;
  left: 0;
  opacity: 0;
  ${fadeOutAnimation}
`;

function PlayerStatus({ children, guessings, isNextPlayer, correctAnswer }) {
  return (
    <Container>
      <PlayerStatusName
        isNextPlayer={isNextPlayer}
        correctAnswer={correctAnswer}
      >
        {children}
      </PlayerStatusName>
      {guessings.map((guessing) => (
        <LastGuessing key={guessing.guess}>{guessing.guess}</LastGuessing>
      ))}
    </Container>
  );
}

export default PlayerStatus;
