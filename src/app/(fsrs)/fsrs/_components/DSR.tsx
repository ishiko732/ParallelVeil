import {Card} from "ts-fsrs";
import FSRS from "ts-fsrs/lib/fsrs";
import {CSSProperties} from "react";
import dayjs, {ConfigType} from "dayjs";


export default function DSR({
                                fsrs = new FSRS(),
                                card,
                                now,
                                style,
                                children
                            }: { card: Card, now: ConfigType, fsrs?: FSRS, style?: CSSProperties, children?: React.ReactNode }) {
    if (!card || !now) {
        return null
    }
    const D = card.difficulty
    const S = card.stability
    const now_date = dayjs(now).toDate()
    const R = fsrs.get_retrievability(card, now_date)
    return R && card.due.getTime() - now_date.getTime() < 0 ?
        <div style={{...style}}>
            <div>D:{`${D.toFixed(2)}`}</div>
            <div>S:{`${S.toFixed(2)}`}</div>
            <div>R:{`${R}`}</div>
            {children}
        </div>
        : null

}