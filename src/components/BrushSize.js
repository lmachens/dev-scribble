import styled from "@emotion/styled";

export const sizes = {
  S: 3,
  M: 6,
  L: 12,
  XL: 15,
};

const BrushSize = styled.div`
  width: ${(props) => sizes[props.size]}px;
  height: ${(props) => sizes[props.size]}px;
  background: #ddd;
  border-radius: 50%;
`;

export default BrushSize;
