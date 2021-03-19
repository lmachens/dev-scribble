import React from "react";
import styled from "@emotion/styled";

const Label = styled.label`
  border: 1px solid;
  padding: 10px 14px;
  border-color: ${(props) => (props.disabled ? "transparent" : "#2f363d")};
  color: ${(props) => (props.disabled ? "#2f363d" : "#ddd")};
  font-family: "Fira Code", monospace;
  font-size: 1.2rem;

  input {
    background: transparent;
    color: #dddacf;
    width: 2.4em;
    font-size: inherit;
    border: none;
    margin-left: 0.5em;
  }

  input:disabled {
    border-color: transparent;
    color: #2f363d;
  }
`;

function RoundSelect({ value, onChange, disabled }) {
  return (
    <Label disabled={disabled}>
      Rounds
      <input
        type="number"
        value={value}
        onChange={onChange}
        max={99}
        min={1}
        disabled={disabled}
      />
    </Label>
  );
}

export default RoundSelect;
