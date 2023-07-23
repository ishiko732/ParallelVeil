import Head from 'next/head';
import Date from '@/components/date';
import {getAllArticleIds, getArticleData} from "@/service/article";
import 'highlight.js/styles/default.css';
import React, {useEffect} from "react";
import {convertMdToHTML} from "@/service/analyzer/help_split";
import {createArticle} from "@/service/db/article";
import {Article, Card, Note} from "@prisma/client";
import createNote from "@/service/db/note";
import {State, StateType} from "ts-fsrs";

interface article {
    id: string,
    title: string,
    date: string,
    language: string,
    text: string
}

export default function Article(props: { articleData: article, convertToHtml: string, words: string }) {

    const {articleData, convertToHtml} = props
    if (articleData.language == undefined) {
        articleData.language = 'Default'
    }
    const pageTitle = `${articleData.language} - ${articleData.title}`;

    useEffect(() => {
        const map = JSON.parse(props.words)
        const pvNotes = document.querySelectorAll(".note") as NodeListOf<HTMLSpanElement>;
        pvNotes.forEach((pvNote) => {
            const note = (map[pvNote.innerText.trim()] as Note & { card: Card })
            const current = State[note.card.state] as StateType
            pvNote.id = note.nid;
            pvNote.dataset["cid"] = note.card.cid
            pvNote.dataset["state"] = current
            switch (State[current]) {
                case State.New:
                    pvNote.className = "note note-new";
                    break
                case State.Learning:
                case State.Relearning:
                    pvNote.className = "note note-learn"
                    break
            }
        });

    }, [props])

    useEffect(() => {
        // 获取所有class为pv-content的元素
        const pvNotes = document.querySelectorAll(".note") as NodeListOf<HTMLSpanElement>;

        // 为每个pv-content元素绑定点击事件
        pvNotes.forEach((pvNote) => {
            pvNote.addEventListener("click", handleClick);
        });

        // 定义点击事件处理函数
        function handleClick(this: HTMLSpanElement) {
            console.log(this.innerText, this.parentElement?.innerText);
            switch (State[this.dataset["state"] as StateType]) {
                case State.New:
                    this.className = "note note-learn"
                    this.dataset["state"] = State[State.Learning]
                    break;
                case State.Learning:
                case State.Relearning:
                    this.className = "note";
                    this.dataset["state"] = State[State.Review]
                    break;
                case State.Review:
                    break;

            }

        }

        // 在组件卸载时解绑所有点击事件
        return () => {
            pvNotes.forEach((pvNote) => {
                pvNote.removeEventListener("click", handleClick);
            });
        };
    }, []);

    return (
        <div>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            <br/>
            <h3>{articleData.id}</h3>
            <br/>
            <Date dateString={articleData.date}/>
            <br/>
            <div dangerouslySetInnerHTML={{__html: convertToHtml}}/>
        </div>
    );
}

export async function getStaticPaths() {
    const paths = getAllArticleIds();
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({params}: { params: article }) {
    const articleData = await getArticleData(params.id);
    const collect = new Set<string>();
    const promiseAll = [convertMdToHTML(articleData.text, collect), createArticle({link: params.id})]
    const [convertToHtml, dbArticle]: (string | Article)[] = await Promise.all(promiseAll)
    // const aid = (dbArticle as Article).aid
    const promiseWords = Array.from(collect).map(word => createNote({
        text: word
    }))
    const words: any = {}
    Array.from(await Promise.all(promiseWords)).forEach(word => words[word.text] = word)

    return {
        props: {
            articleData,
            convertToHtml: convertToHtml,
            dbArticle,
            words: JSON.stringify(words)
        },
    };
}
