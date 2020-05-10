import React, { useEffect, useState } from "react";
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
  const [guess, setGuess] = useState("");
  const [key] = useKeyDownState("");

  useEffect(() => {
    setGuess("");
  }, [round, setGuess]);

  useEffect(() => {
    if (key === "Backspace") {
      setGuess((guess) => guess.substring(0, guess.length - 1));
    } else if (key.length === 1) {
      setGuess((guess) => guess + key);
    }
  }, [key]);

  useEffect(() => {
    if (guess.length === secretLength) {
      onSubmit(guess);
      setGuess("");
    }
  }, [guess, secretLength, onSubmit, setGuess]);

  function handleInputChange(event) {
    event.stopPropagation();
    setGuess(event.target.value.trim());
  }

  return (
    <Container>
      <HiddenInput
        value={guess}
        onChange={handleInputChange}
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
