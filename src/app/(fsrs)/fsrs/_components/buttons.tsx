import { Card, Rating, ReviewLog, show_diff_message } from "ts-fsrs";
import FSRS from "ts-fsrs/lib/fsrs";
import dayjs, { ConfigType } from "dayjs";
import { CSSProperties } from "react";

const defaultGroups = [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy];

type indexType = "0" | "1" | "2" | "3";

export default function GradeButtons({
  card,
  now,
  fsrs,
  handleClick,
  groups = defaultGroups,
  style,
}: {
  card: Card;
  now: ConfigType;
  fsrs: FSRS;
  handleClick: (gradle: { card: Card; log: ReviewLog }) => void;
  groups?: Rating[];
  style?: CSSProperties;
}) {
  if (!card) {
    return null;
  }
  const date = dayjs(now);
  const repeat = fsrs.repeat(card, date.toDate());
  return groups.length > 0 ? (
    <div
      style={style}
      className={"flex items-center space-x-2 rounded-b"}
      role={"GradeButtons"}
    >
      {groups.map((grade) => {
        const _grade = repeat[String(grade.valueOf()) as indexType];
        const diff = show_diff_message(
          _grade.card.due,
          _grade.card.last_review as Date,
          true,
        );
        // console.log(_grade.card, diff)
        return (
          <button
            key={Rating[grade]}
            type={"button"}
            className={
              "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            }
            // style={{textTransform: 'capitalize'}}
            onClick={() => {
              handleClick(_grade);
            }}
          >
            {`${Rating[grade]}(${diff})`}
          </button>
        );
      })}
    </div>
  ) : null;
}
