import React from "react";
import {getArticleData} from "@/app/(article)/service/article";
import {convertMdToHTML} from "@/service/analyzer/help_split";
import {createArticle} from "@/service/db/article";
import {Article} from "@prisma/client";
import {createNote} from "@/service/db/note";
import ArticleClientComponent from "@/app/(article)/article/_components/content_id"
import {FSRSProvider} from "@/context/fsrsContext";
import process from "process";
import {findParamsByUid} from "@/service/db/params";
import {transParameters} from "@/app/(fsrs)/fsrs/help";
import {Metadata, ResolvingMetadata} from 'next'
import path from "path";
import fs from "fs";
import {ArticlesDirectory} from "@/config/article";
import ArticleLink from "@/app/(article)/article/_components/articleLink";
import {loggerDebug} from "@/config/pinoConfig";

export default async function Page({params}: { params: { slug: string[] } }) {
    const {slug} = params
    const _id = path.join(...slug)
    const articleData = await getArticleData(_id);
    if (Array.isArray(articleData)) {
        return articleData.map((articleData) => <ArticleLink key={articleData.params.id}
                                                             articleData={articleData.params}/>)
    }
    const collect = new Set<string>();
    const promiseAll = [convertMdToHTML(articleData.text, collect), createArticle({link: _id})]
    const [convertToHtml, dbArticle]: (string | Article)[] = await Promise.all(promiseAll)
    // const aid = (dbArticle as Article).aid
    const promiseWords = Array.from(collect).map(word => createNote({
        text: word
    }))
    const words: any = {}
    Array.from(await Promise.all(promiseWords)).forEach(word => words[word.text] = word)
    const uid = Number(process.env.uid)
    return <>
        <FSRSProvider uid={uid} p={transParameters(await findParamsByUid({uid}))}>
            <ArticleClientComponent articleData={articleData} convertToHtml={convertToHtml.toString()} words={words}/>
        </FSRSProvider>
    </>
}

type Props = {
    params: { slug: string[] }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    {params, searchParams}: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const _id = path.join(...params.slug)
    loggerDebug("metadataIds", params.slug)
    // fetch data
    const articleData = await getArticleData(_id);
    loggerDebug("metaData", {articleData,"test":Array.isArray(articleData)})
    if (Array.isArray(articleData)) {
        return {
            title: `Parallel Veil - Article`
        }
    }
    return {
        title: articleData.title,
        description: articleData.text.substring(0, 300),

    }
}