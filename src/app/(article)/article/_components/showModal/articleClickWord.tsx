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
import { Divider, Stack } from "@mui/material";
import GradeButtons from "@/app/(fsrs)/fsrs/_components/buttons";
import { transCard } from "@/app/(fsrs)/fsrs/help";
import { Rating, State } from "ts-fsrs";
import DSR from "@/app/(fsrs)/fsrs/_components/DSR";
import GPT from "@/app/(article)/article/_components/gpt";
import { observer } from "mobx-react-lite";
import { useShowModalStoreStore } from "@/app/(article)/article/_hooks/useShowModal";
import { useSpanStore } from "@/app/(article)/article/_hooks/useSpanStore";
import Loading from "@/components/Loading";
import WordClose from "@/app/(article)/article/_components/showModal/WordClose";

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
      ref={thisRef}
      className={
        "bg-white text-black dark:bg-gray-700 dark:text-white overflow-x-hidden overflow-y-auto rounded-lg"
      }
    >
      {data.note && data.note.card ? (
        <div className={"relative w-full max-w-md max-h-full"}>
          <div className={"relative rounded-lg shadow "}>
            <div
              className={"items-center border-b rounded-t dark:border-gray-600"}
            >
              <div className="flex items-center justify-between p-5 flex-row">
                <div>
                  <DSR
                    card={transCard(data.note.card)}
                    now={dayjs()}
                    fsrs={f}
                    className={"text-xs flex flex-col"}
                  />
                </div>
                <div className={"content-center"}>
                  <StateChip state={data.note.card.state} value={word} />
                </div>
                <WordClose
                  handleClick={(e) => {
                    showModalStore.updateOpen(false);
                  }}
                />
              </div>
              <QuoteContainer className={"pb-1.5 mx-5 w-auto"}>
                {phrase}
              </QuoteContainer>
            </div>
            <div className={"p-6 space-y-6"}>
              {/*<div>*/}
              {/*  /!*  <div>*!/*/}
              {/*  /!*    {data.ejje ? (*!/*/}
              {/*  /!*      data.ejje.map((answer: any, index: number) => (*!/*/}
              {/*  /!*        <p key={`ejje-answer${index}`}>{JSON.stringify(answer)}</p>*!/*/}
              {/*  /!*      ))*!/*/}
              {/*  /!*    ) : (*!/*/}
              {/*  /!*      <CircularProgress />*!/*/}
              {/*  /!*    )}*!/*/}
              {/*  /!*  </div>*!/*/}
              {/*  /!*  <div>*!/*/}
              {/*  /!*    {data.jisho ? (*!/*/}
              {/*  /!*      data.jisho.map((answer: any, index: number) => (*!/*/}
              {/*  /!*        <p key={`jisho-answer${index}`}>{JSON.stringify(answer)}</p>*!/*/}
              {/*  /!*      ))*!/*/}
              {/*  /!*    ) : (*!/*/}
              {/*  /!*      <CircularProgress />*!/*/}
              {/*  /!*    )}*!/*/}
              {/*  /!*  </div>*!/*/}
              {/*</div>*/}
              <GPT word={word} phrase={phrase} />
            </div>
            <div
              className={
                "flex justify-center py-1.5 w-full border-t border-gray-200  dark:border-gray-600 pt-2.5 pb-5"
              }
            >
              <GradeButtons
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
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </ShowModal>
  ) : null;
});

export default ArticleClickWord;
