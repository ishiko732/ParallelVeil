import Head from "next/head";
import React from "react";
// import ArticleClientComponent from "@/components/article/content_id";
import {getArticleData} from "@/service/article";
import {convertMdToHTML} from "@/service/analyzer/help_split";
import {createArticle} from "@/service/db/article";
import {Article} from "@prisma/client";
import {createNote} from "@/service/db/note";
import ArticleClientComponent from "@/app/(article)/article/_components/content_id"

export default async function Page({params}: { params: { id: string } }) {
    const {id} = params
    const articleData = await getArticleData(id);
    const collect = new Set<string>();
    const promiseAll = [convertMdToHTML(articleData.text, collect), createArticle({link: id})]
    const [convertToHtml, dbArticle]: (string | Article)[] = await Promise.all(promiseAll)
    // const aid = (dbArticle as Article).aid
    const promiseWords = Array.from(collect).map(word => createNote({
        text: word
    }))
    const words: any = {}
    Array.from(await Promise.all(promiseWords)).forEach(word => words[word.text] = word)

    return <>
        <Head>
            <title>{params.id}</title>
        </Head>
        <ArticleClientComponent articleData={articleData} convertToHtml={convertToHtml.toString()} words={words}/>
    </>
}