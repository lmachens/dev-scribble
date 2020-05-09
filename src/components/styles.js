import { css, keyframes } from "@emotion/core";

export const goldenRatioFullscreen = css`
  min-height: 100vh;
  width: 100vw;
  padding: 5vh 10px 20vh 10px;
`;

export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const blink = keyframes`
  from {
    color: inherit;
  }

  50% {
    color: #116db6;

  }

  to {
    color: inherit;
  }
`;

export const blinkAnimation = css`
  animation: ${blink} 1s ease infinite;
`;

export const fade = keyframes`
  from {
    opacity: 1;
  }

  50% {
    opacity: 0.2;

  }

  to {
    opacity: 1;
  }
`;

export const fadeAnimation = css`
  animation: ${fade} 2s ease infinite;
`;

export const scrollBackground = keyframes`
  from {
    background-position-x: 0px;
  }

  to {
    background-position-x: 10000px
  }
`;
