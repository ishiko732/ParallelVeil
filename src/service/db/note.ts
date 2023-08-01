import {Prisma} from "@prisma/client";
import prisma from "@/service/db/index";
import {Card as fsrsCard, createEmptyCard, ReviewLog as fsrsLog} from "ts-fsrs";

export async function createNote(data: Prisma.NoteCreateInput) {
    const {text, type, language} = data
    const existingNote = await prisma.note.findFirst({
        where: {text: text as string, type, language},
        include: {
            card: true
        }
    })

    if (existingNote) {
        // console.log(text + 'note already exists')
        return existingNote
    }
    const emptyCard = createEmptyCard()

    return prisma.note.create({
        data: {
            text: text as string,
            card: {
                create: {
                    ...emptyCard,
                    state: emptyCard.state,
                    type: 0 // 0表示单词
                }
            },
        },
        include: {
            card: true,
        },
    })
}

export async function findNote_by_nid(data: Prisma.NoteWhereUniqueInput) {
    return prisma.note.findUnique({
        where: data,
        include: {
            card: true
        }
    })

}


export async function updateNote(data: Prisma.NoteUpdateWithoutNotesInput, _card?: fsrsCard, _log?: fsrsLog) {
    return prisma.note.update({
        where: {
            nid: data.nid as string
        },
        data: geneUpdateData(data, _card, _log),
        include: {
            card: true
        }
    })
}

function geneUpdateData(data: Prisma.NoteUpdateWithoutNotesInput | any, _card?: fsrsCard, _log?: fsrsLog) {
    data.card = {}
    delete data['parentId']
    delete data['parent']
    delete data['notes']
    delete data['articleNote']
    if (_card) {
        data.card = {
            update: {
                ..._card,
            }
        }
        delete data.card.update['cid']
        delete data.card.update['nid']
        delete data.card.update['log']
        if (_log) {
            data.card.update.log = {}
            data.card.update.log.create = {
                ..._log,
                grade: _log.rating

            }
            delete data.card.update.log.create['rating']

        }
    }
    return data;
}

