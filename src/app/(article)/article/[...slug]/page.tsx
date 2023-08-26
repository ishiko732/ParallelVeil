import React from "react";
import {convertMdToHTML} from "@/service/analyzer/help_split";
import {createArticle} from "@/service/db/article";
import {Article} from "@prisma/client";
import {createNote} from "@/service/db/note";
import ArticleClientComponent from "@/app/(article)/article/_components/content_id"
import {FSRSProvider} from "@/context/fsrsContext";
import process from "process";
import {findParamsByUid} from "@/service/db/params";
import {transParameters} from "@/app/(fsrs)/fsrs/help";
import {Metadata} from 'next'
import {articleData, getArticleData, getArticlePaths} from "@/app/(article)/service/article_watch";
import ArticlePaths from "@/app/(article)/article/_components/articlePaths";

export default async function Page({params}: { params: { slug: string[] } }) {
    const {slug} = params
    const _id = slug.join("/")
    const fileValue = await getArticleData(slug);
    if (Array.isArray(fileValue) || !fileValue.file) {
        return <ArticlePaths articlePaths={await getArticlePaths(slug)}/>
    }
    const articleData = fileValue.value as articleData
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
): Promise<Metadata> {
    const fileValue = await getArticleData(params.slug);
    if (Array.isArray(fileValue) || !fileValue.file) {
        return {
            title: `Parallel Veil - ${params.slug.join('/') || 'Article'}`
        }
    }
    const articleData = fileValue.value as articleData
    return {
        title: articleData.title,
        description: articleData.text.substring(0, 300),

    }
}