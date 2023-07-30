import styled from 'styled-components';
import {CSSProperties} from "react";

interface showModalProps {
    popupPosition: point
    color?: string
    style?: CSSProperties
}

const ShowModal = styled.div<showModalProps>`
  position: fixed;
  top: ${(props: showModalProps) => props.popupPosition.y};
  left: ${(props: showModalProps) => props.popupPosition.x};
  background-color: ${(props: showModalProps) => props.color || '#fff'};
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  padding: 10px;
... style
`;

export default ShowModal;