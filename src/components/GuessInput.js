import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { blinkAnimation } from "./styles";
import useKeyDownState from "../hooks/useKeyDownState";

const Char = styled.span`
  margin: 2px;
  ${(props) => (props.blink ? blinkAnimation : "")};
`;

function GuessInput({ onSubmit, secretLength, round }) {
  const [guess, setGuess] = useKeyDownState("");

  useEffect(() => {
    setGuess("");
  }, [round, setGuess]);

  useEffect(() => {
    if (guess.length === secretLength) {
      onSubmit(guess);
      setGuess("");
    }
  }, [guess, secretLength, onSubmit, setGuess]);

  return (
    <>
      {Array(secretLength)
        .fill(null)
        .map((_, index) => (
          <Char key={index} blink={guess.length === index}>
            {guess[index] || "_"}
          </Char>
        ))}
    </>
  );
}

export default GuessInput;
