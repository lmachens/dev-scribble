import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const Button = styled.button`
  display: inline-block;
  cursor: pointer;
  color: #ddd;
  background: none;
  border: 1px solid #2f363d;
  padding: 10px 14px;
  font-size: 1.2rem;
  transition: 0.2s;
  text-decoration: none;
  font-family: "Fira Code", monospace;

  :hover {
    color: #ddd;
    background: #2f363d;
  }

  :disabled {
    color: #2f363d;
    border-color: transparent;
  }
`;

export const ButtonLink = ({ href, ...rest }) => (
  <Link to={href}>
    <Button {...rest} />
  </Link>
);
export default Button;
