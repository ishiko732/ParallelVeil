'use server'
import {Prisma, PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()


export async function findParamsByUid(data: Prisma.ParametersWhereUniqueInput) {
    return prisma.parameters.findUnique({
        where: data
    })
}
