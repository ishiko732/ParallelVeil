import styled from 'styled-components';
import {CSSProperties} from "react";

interface showModalProps {
    x?: number,
    y?: number
    color?: string
    style?: CSSProperties
}

const ShowModal = styled.div<showModalProps>`
  position: fixed;
  top: ${(props: showModalProps) => `${props.y}px` || 0};
  left: ${(props: showModalProps) => `${props.x}px` || 0};
  background-color: ${(props: showModalProps) => props.color || '#fff'};
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  padding: 10px;
  word-break: keep-all;
  overflow: auto;
  max-height: 250px;
... style
`;

export default ShowModal;