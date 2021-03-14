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
    if (keyEvent.key === "Enter") {
      setGuess((guess) => {
        onSubmit(guess);
        return "";
      });
    } else if (keyEvent.key === "Backspace") {
      setGuess((guess) => guess.substring(0, guess.length - 1));
    } else if (keyEvent.key.length === 1) {
      setGuess((guess) => guess + keyEvent.key);
    }
  }, [keyEvent, onSubmit]);

  useEffect(() => {
    if (guess.length > 0 && guess.length === secretLength) {
      onSubmit(guess);
      setGuess("");
    }
  }, [guess, secretLength, onSubmit, setGuess]);

  return (
    <Container>
      <HiddenInput
        value={guess}
        onChange={() => {}}
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
