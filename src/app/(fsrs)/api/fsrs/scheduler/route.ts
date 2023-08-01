import {NextRequest, NextResponse} from "next/server";
import {Card as fsrsCard, ReviewLog as fsrsLog} from "ts-fsrs";
import {updateNote} from "@/service/db/note";
import {Prisma} from "@prisma/client";

interface putBody {
    _note: Prisma.NoteUpdateWithoutNotesInput,
    _card: fsrsCard,
    _log: fsrsLog
}

export async function PUT(request: NextRequest) {
    const body = await request.json() as putBody
    const {_note, _card, _log} = body;

    const data = await updateNote(_note, _card, _log)
    return NextResponse.json(data, {status: 200})
}