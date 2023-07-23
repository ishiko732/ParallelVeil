import {Prisma, PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export async function createArticle(data: Prisma.ArticleUncheckedCreateInput) {
    const {aid, link} = data
    const existingArticle = await prisma.article.findFirst({
        where: aid ? {aid} : {link}
    })

    if (existingArticle) {
        console.log('article already exists')
        return existingArticle
    }
    return prisma.article.create({
        data: {
            link
        },
    })
}

export async function updateArticle(data: Prisma.ArticleUncheckedUpdateInput) {
    const {aid, link, read, position} = data
    if (aid === null) {
        console.log('note not exists')
    }
    const existingArticle = await prisma.article.findFirst({
        where: {aid: aid as number}
    })
    if (!existingArticle) {
        console.log('article no exists')
        return existingArticle
    }
    return prisma.article.update({
        where: {aid: aid as number},
        data: {
            link, read, position
        }
    })
}