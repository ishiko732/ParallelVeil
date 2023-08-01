import {Card as prismaCard, Parameters} from "@prisma/client";
import {Card as fsrsCard, FSRSParameters, generatorParameters} from "ts-fsrs";
import dayjs from "dayjs";


export function transCard(card: prismaCard): fsrsCard {
    return {
        ...card,
        due: dayjs(card.due).toDate(),
        last_review: card.last_review ? dayjs(card.last_review).toDate() : undefined
    }
}

export function transParameters(params: Parameters | null): FSRSParameters {
    return params ? {
        ...params,
        ...JSON.parse(params.w),
        request_retention: params.request_retention.toNumber(),
        easy_bonus: params.easy_bonus.toNumber(),
        hard_factor: params.hard_factor.toNumber(),
    } : generatorParameters()
}