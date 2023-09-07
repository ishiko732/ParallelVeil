"use client";
import styled from "styled-components";
import { CSSProperties } from "react";
import { useSpanStore } from "@/app/(article)/article/_hooks/useSpanStore";
import { State } from "ts-fsrs";
import dayjs from "dayjs";

export default function PVSpan({ children, className, style }: any) {
  const store = useSpanStore();
  const note = store.getNote(children);
  let cn = "";
  if (note && note.card) {
    let now = dayjs().toDate().getTime();
    switch (note.card.state) {
      case State.New:
        cn = "note note-new";
        break;
      case State.Learning:
      case State.Relearning:
        cn = "note note-learn";
        break;
      case State.Review:
        if (note.card.due.getTime() - now < 0) {
          cn = "note note-recall";
        }
        break;
    }
  }
  return (
    <span className={[className, cn].join(" ")} style={style}>
      {children}
    </span>
  );
}

const SpanAfter = styled.span<{ style?: CSSProperties; className?: string }>`
  &:after {
    content: " ";
    white-space: nowrap;
  }
`;
