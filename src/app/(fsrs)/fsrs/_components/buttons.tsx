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
      className={"inline-flex rounded-md shadow-sm"}
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
              "px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-l-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
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
