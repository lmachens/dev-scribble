import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { blinkAnimation } from "./styles";
import useKeyDownState from "../hooks/useKeyDownState";

const Char = styled.span`
  margin: 2px;
  ${(props) => (props.blink ? blinkAnimation : "")};
`;

const Container = styled.div`
  position: relative;
`;

const HiddenInput = styled.input`
  opacity: 0;
  position: absolute;
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
    <Container>
      <HiddenInput
        value={guess}
        autoFocus
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
      />
      {Array(secretLength)
        .fill(null)
        .map((_, index) => (
          <Char key={index} blink={guess.length === index}>
            {guess[index] || "_"}
          </Char>
        ))}
    </Container>
  );
}

export default GuessInput;
