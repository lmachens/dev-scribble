import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { blinkAnimation } from "./styles";
import useKeyDownState from "../hooks/useKeyDownState";

const Char = styled.span`
  margin: 2px;
  opacity: ${(props) => (props.hint ? 0.5 : 1)};
  ${(props) => (props.blink ? blinkAnimation : "")};
`;

const Container = styled.div`
  position: relative;
`;

const HiddenInput = styled.input`
  opacity: 0;
  position: absolute;
`;

function GuessInput({ onSubmit, secretLength, round, secretHints }) {
  const [guess, setGuess] = useState("");
  const [keyEvent] = useKeyDownState();

  useEffect(() => {
    setGuess("");
  }, [round, setGuess]);

  useEffect(() => {
    if (!keyEvent) {
      return;
    }
    if (keyEvent.key === "Backspace") {
      setGuess((guess) => guess.substring(0, guess.length - 1));
    } else if (keyEvent.key.length === 1) {
      setGuess((guess) => guess + keyEvent.key);
    }
  }, [keyEvent]);

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
          <Char
            key={index}
            blink={guess.length === index}
            hint={Boolean(secretHints[index])}
          >
            {guess[index] || secretHints[index] || "_"}
          </Char>
        ))}
    </Container>
  );
}

export default GuessInput;
