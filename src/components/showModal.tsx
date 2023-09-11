import styled from "styled-components";
import { CSSProperties } from "react";

interface showModalProps {
  x?: number;
  y?: number;
  color?: string;
  style?: CSSProperties;
}

const ShowModal = styled.div<showModalProps>`
  position: fixed;
  top: ${(props: showModalProps) => `${props.y}px` || 0};
  left: ${(props: showModalProps) => `${props.x}px` || 0};
...style
`;

export default ShowModal;
