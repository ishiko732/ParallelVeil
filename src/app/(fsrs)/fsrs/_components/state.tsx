import {State} from "ts-fsrs";
import styled from 'styled-components';
import {CSSProperties} from "react";

export default function StateChip({state, style, value}: { state: State, value?: string, style?: CSSProperties }) {
    switch (state) {
        case State.New:
            return <Chip color='#dae3fc' style={{...style}}>{value ? value : `${State[state]}`}</Chip>
        case State.Learning:
        case State.Relearning:
            return <Chip color='#97f7ad' style={{...style}}>{value ? value : `${State[state]}`}</Chip>
        case State.Review:
            return <Chip color='#f59b80' style={{...style}}>{value ? value : `${State[state]}`}</Chip>
    }
}

interface StateChipProps {
    color?: string
    style?: CSSProperties
}

const Chip = styled.span<StateChipProps>`
  overflow: hidden;
  color: #000;
  background-color: ${(props: StateChipProps) => props.color};
  white-space: nowrap;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 24px;
`;