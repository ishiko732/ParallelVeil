import { State } from "ts-fsrs";
import styled from "styled-components";
import { CSSProperties, ReactNode } from "react";

export default function StateChip({
  state,
  value,
}: {
  state: State;
  value?: string;
}) {
  switch (state) {
    case State.New:
      return (
        <Chip className={"bg-violet-200 dark:bg-violet-400"}>
          {value ? value : `${State[state]}`}
        </Chip>
      );
    case State.Learning:
    case State.Relearning:
      return (
        <Chip className={"bg-green-300 dark:bg-green-600"}>
          {value ? value : `${State[state]}`}
        </Chip>
      );
    case State.Review:
      return (
        <Chip className={"bg-orange-300 dark:bg-orange-500"}>
          {value ? value : `${State[state]}`}
        </Chip>
      );
  }
}

function Chip({
  style,
  children,
  className = "",
}: {
  children: string | ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <span
      style={style}
      className={
        "px-2 py-1 mx-2 rounded text-lg strong text-center dark:text-white " +
        (className ? className : "")
      }
    >
      {children}
    </span>
  );
}
