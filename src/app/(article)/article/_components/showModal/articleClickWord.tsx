import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import FSRSContext from "@/context/fsrsContext";
import dayjs from "dayjs";
import { Card as fsrsCard, ReviewLog as fsrsLog } from "ts-fsrs/lib/models";
import ShowModal from "@/components/showModal";
import StateChip from "@/app/(fsrs)/fsrs/_components/state";
import QuoteContainer from "@/app/(article)/article/_components/quote";
import { CircularProgress, Divider, Stack } from "@mui/material";
import GradeButtons from "@/app/(fsrs)/fsrs/_components/buttons";
import { transCard } from "@/app/(fsrs)/fsrs/help";
import { Rating, State } from "ts-fsrs";
import DSR from "@/app/(fsrs)/fsrs/_components/DSR";
import GPT from "@/app/(article)/article/_components/gpt";
import { observer } from "mobx-react-lite";
import { useShowModalStoreStore } from "@/app/(article)/article/_hooks/useShowModal";
import { useSpanStore } from "@/app/(article)/article/_hooks/useSpanStore";

const ArticleClickWord: FC = observer(function () {
  const { f } = useContext(FSRSContext);
  const thisRef = useRef<HTMLDivElement>(null);
  const store = useSpanStore();
  const showModalStore = useShowModalStoreStore();
  const { word, phrase, data } = showModalStore.current;
  const handleClickOutside = (event: MouseEvent) => {
    if (thisRef.current && !thisRef.current.contains(event.target as Node)) {
      showModalStore.updateOpen(false);
    }
  };

  useEffect(() => {
    if (showModalStore.open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside, showModalStore.open]);
  const now = dayjs().toDate().getTime();
  const handleClick = (gradle: { card: fsrsCard; log: fsrsLog }) => {
    showModalStore.updateOpen(false);
    const note = JSON.parse(JSON.stringify(data.note));
    const _json = {
      _note: { ...note, readed: true },
      _card: gradle.card,
      _log: gradle.log,
    };
    (async () => {
      store.updateNote(word, _json);
    })();
    console.log(_json);
  };
  return showModalStore.open ? (
    <ShowModal
      x={showModalStore.point.x}
      y={showModalStore.point.y}
      style={{
        maxWidth: "500px",
      }}
      ref={thisRef}
      className={"bg-white text-black dark:bg-gray-700 dark:text-white"}
    >
      {data.note && data.note.card ? (
        <>
          <div className={"antialiased dark:text-white"}>
            <div className={"flex justify-center items-center content-center"}>
              <StateChip state={data.note.card.state} value={word} />
            </div>
            <QuoteContainer className={"py-[5] w-auto"}>
              {phrase}
            </QuoteContainer>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <GradeButtons
                style={{ paddingTop: "10px" }}
                card={transCard(data.note.card)}
                now={dayjs()}
                fsrs={f}
                groups={
                  data.note.card.state != State.Review ||
                  dayjs(data.note.card.due).diff(now) < 0
                    ? undefined
                    : [Rating.Again]
                }
                handleClick={handleClick}
              />
              <DSR
                card={transCard(data.note.card)}
                now={dayjs()}
                fsrs={f}
                style={{
                  fontSize: "12px",
                  display: "flex",
                  flexDirection: "column",
                }}
              />
            </Stack>
          </div>
          <Divider style={{ paddingTop: "10px", width: "auto" }} />
          <div>
            <div>
              {data.ejje ? (
                data.ejje.map((answer: any, index: number) => (
                  <p key={`ejje-answer${index}`}>{JSON.stringify(answer)}</p>
                ))
              ) : (
                <CircularProgress />
              )}
            </div>
            <div>
              {data.jisho ? (
                data.jisho.map((answer: any, index: number) => (
                  <p key={`jisho-answer${index}`}>{JSON.stringify(answer)}</p>
                ))
              ) : (
                <CircularProgress />
              )}
            </div>
            <GPT word={word} phrase={phrase} />
          </div>
        </>
      ) : (
        <CircularProgress />
      )}
    </ShowModal>
  ) : null;
});

export default ArticleClickWord;
