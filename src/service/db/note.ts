import {Prisma, PrismaClient} from "@prisma/client";
import {createEmptyCard} from "ts-fsrs";

const prisma = new PrismaClient()

export async function createNote(data: Prisma.NoteCreateInput) {
    const {text, type, language} = data
    const existingNote = await prisma.note.findFirst({
        where: {text: text as string, type, language},
        include: {
            card: true
        }
    })

    if (existingNote) {
        console.log(text + 'note already exists')
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
