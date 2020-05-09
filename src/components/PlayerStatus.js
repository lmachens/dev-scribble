import styled from "@emotion/styled";
import PlayerName from "./PlayerName";
import { css } from "@emotion/core";
import { scrollBackground, fadeAnimation } from "./styles";

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

const PlayerStatus = styled(PlayerName)`
  ${getStatusStyles};
`;
export default PlayerStatus;
