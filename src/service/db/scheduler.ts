import prisma from "@/service/db/index";
import {Card as fsrsCard, ReviewLog as fsrsLog} from "ts-fsrs";

export async function updateCard(cid: string, _card: fsrsCard, _log: fsrsLog) {
    const card = prisma.card.update({
        where: {
            cid
        },
        data: {
            ..._card,
        }
    })
    const log = await prisma.revlog.create({data: {..._log, cid, grade: _log.rating}})
    // TODO Refactor
    return card
}


