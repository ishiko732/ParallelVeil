"use client";
import styled from "styled-components";
import React, { CSSProperties } from "react";
import { useSpanStore } from "@/app/(article)/article/_hooks/useSpanStore";
import { State } from "ts-fsrs";
import dayjs from "dayjs";
import { Card, Note } from "@prisma/client";
import { useShowModalStoreStore } from "@/app/(article)/article/_hooks/useShowModal";
import { observer } from "mobx-react-lite";

function PVSpan({ children, className, style }: any) {
  const store = useSpanStore();
  const showModalStore = useShowModalStoreStore();
  const note = store.getNote(children);
  const cn = getClassName(note);
  const text = note?.text || "";
  const handleClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    const vm = event.target as HTMLSpanElement;
    const phrase = vm.parentElement?.parentElement?.innerText || "";
    const point = {
      x: vm.offsetWidth + vm.offsetLeft,
      y: event.clientY,
    };
    showModalStore.updatePoint(point);
    showModalStore.updateOpen(true);
    showModalStore.setCurrent(text, phrase, note.nid);
  };

  return (
    <span
      className={[className, cn].join(" ")}
      style={style}
      onClick={handleClick}
    >
      {children + " "}
    </span>
  );
}

function getClassName(note: Note & { card: Card | null }) {
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
  return cn;
}

const SpanAfter = styled.span<{ style?: CSSProperties; className?: string }>`
  &:after {
    content: " ";
    white-space: nowrap;
  }
`;

export default observer(PVSpan);
