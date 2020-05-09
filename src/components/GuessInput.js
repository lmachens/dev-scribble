import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { blinkAnimation } from "./styles";

const Char = styled.span`
  margin: 2px;
  ${(props) => (props.blink ? blinkAnimation : "")};
`;

function GuessInput({ onSubmit, secretLength, round }) {
  const [guess, setGuess] = useState("");

  useEffect(() => {
    setGuess("");
  }, [round]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Backspace") {
        setGuess((guess) => guess.substring(0, guess.length - 1));
      } else if (event.key.trim().length === 1) {
        setGuess((guess) => guess + event.key);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (guess.length === secretLength) {
      onSubmit(guess);
      setGuess("");
    }
  }, [guess, secretLength, onSubmit]);

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
