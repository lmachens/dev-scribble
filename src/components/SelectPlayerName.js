import React, { useState } from "react";
import robotFace from "../assets/robot_face.png";
import { usePlayerName } from "../contexts/playerName";
import styled from "@emotion/styled";
import Form from "./Form";
import { flexCenter } from "./styles";
import Button from "./Button";

const FlexForm = styled(Form)`
  ${flexCenter};

  label {
    margin-top: 10px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 2rem;
    position: relative;
  }

  input {
    margin-top: 30px;
    font-size: 1.6rem;
    border: none;
    background: none;
    border-bottom: 1px solid #2f363d;
    width: 270px;
    text-align: center;
    background: linear-gradient(
      53.13deg,
      #ffd33d 0,
      #fb8532 19.02%,
      #ea4a5a 37.19%,
      #8a63d2 56.92%,
      #2188ff 79.93%,
      #34d058 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-transform: uppercase;
    outline: none;
    transition: 0.2s;

    :focus {
      border-color: #116db6;
    }
  }
`;

function SelectPlayerName({ onSubmit }) {
  const [playerName, setPlayerName] = usePlayerName();
  const [tempPlayerName, setTempPlayerName] = useState(playerName);

  function handlePlayerNameChange(event) {
    const newPlayerName = event.target.value.trim().toUpperCase();
    if (newPlayerName.length > 9) {
      return;
    }
    setTempPlayerName(newPlayerName);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setPlayerName(tempPlayerName);
    if (onSubmit) {
      onSubmit(playerName);
    }
  }

  return (
    <FlexForm onSubmit={handleSubmit}>
      <img src={robotFace} alt="Surprised Robot Face" />
      <label>
        Who are you?
        <input
          value={tempPlayerName}
          onChange={handlePlayerNameChange}
          autoFocus
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
        />
      </label>
      <Button disabled={tempPlayerName.length === 0}>Let me in</Button>
    </FlexForm>
  );
}

export default SelectPlayerName;
