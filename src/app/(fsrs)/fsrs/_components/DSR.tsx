import {Card} from "ts-fsrs";
import FSRS from "ts-fsrs/lib/fsrs";
import {CSSProperties} from "react";
import dayjs, {ConfigType} from "dayjs";


export default function DSR({
                                fsrs = new FSRS(),
                                card,
                                now,
                                style
                            }: { card: Card, now: ConfigType, fsrs?: FSRS, style?: CSSProperties }) {
    const D = card.difficulty
    const S = card.stability
    const R = fsrs.get_retrievability(card, dayjs(now).toDate())
    return R ? <div style={{...style}}>
        <p>D:{`${D.toFixed(2)}`}</p>
        <p>S:{`${S.toFixed(2)}`}</p>
        <p>R:{`${R}`}</p>
    </div> : null

}