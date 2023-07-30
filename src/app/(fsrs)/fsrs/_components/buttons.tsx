import {Card, Rating, ReviewLog, show_diff_message} from "ts-fsrs";
import FSRS from "ts-fsrs/lib/fsrs";
import {Button, ButtonGroup} from "@mui/material";
import dayjs, {ConfigType} from "dayjs";
import {CSSProperties} from "react";

const defaultGroups = [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy]

type indexType = '0' | '1' | '2' | '3'

export default function GradeButtons({
                                         card,
                                         now,
                                         fsrs,
                                         handleClick,
                                         groups = defaultGroups,
                                         style
                                     }:
                                         { card: Card, now: ConfigType, fsrs: FSRS, handleClick: (gradle: { card: Card, log: ReviewLog }) => void, groups?: Rating[], style?: CSSProperties }) {

    const date = dayjs(now)
    const repeat = fsrs.repeat(card, date.toDate());
    return groups.length > 0 ?
        (<ButtonGroup size="small" style={{...style}}>
            {
                groups.map(grade => {
                    const _grade = repeat[String(grade.valueOf()) as indexType];
                    const diff = show_diff_message(_grade.card.due, _grade.card.last_review as Date, true)
                    console.log(_grade.card, diff)
                    return (
                        <Button key={Rating[grade]}
                                style={{textTransform: 'capitalize'}}
                                onClick={() => {
                                    handleClick(_grade)
                                }}>
                            {`${Rating[grade]}(${diff})`}
                        </Button>)
                })
            }
        </ButtonGroup>)
        : null
}