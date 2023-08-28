'use server'
import {Prisma} from "@prisma/client";
import prisma from "@/service/db/index";


export async function findParamsByUid(data: Prisma.ParametersWhereUniqueInput) {
    return prisma.parameters.findUnique({
        where: data
    })
}
