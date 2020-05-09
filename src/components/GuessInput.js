import React, { useState, useEffect } from "react";
import Form from "./Form";
import styled from "@emotion/styled";
import { blinkAnimation } from "./styles";

const HiddenInput = styled.input`
  opacity: 0;
  position: absolute;
`;

const Char = styled.span`
  margin: 2px;
  ${(props) => (props.blink ? blinkAnimation : "")};
`;

function GuessInput({ onSubmit, secretLength, round }) {
  const [guess, setGuess] = useState("");

  useEffect(() => {
    setGuess("");
  }, [round]);

  function handleGuessChange(event) {
    const newGuess = event.target.value.trim();
    if (newGuess.length === secretLength) {
      handleSubmit();
      return;
    }
    setGuess(newGuess);
  }

  function handleSubmit() {
    onSubmit(guess);
    setGuess("");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <HiddenInput autoFocus value={guess} onChange={handleGuessChange} />
      {Array(secretLength)
        .fill(null)
        .map((_, index) => (
          <Char key={index} blink={!guess[index]}>
            {guess[index] || "_"}
          </Char>
        ))}
    </Form>
  );
}

export default GuessInput;
