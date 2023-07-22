import Head from 'next/head';
import Date from '@/components/date';
import {getAllArticleIds, getArticleData} from "@/service/article";
import 'highlight.js/styles/default.css';
import React, {useEffect} from "react";
import {convertMdToHTML} from "@/service/analyzer/help_split";

interface article {
    id: string,
    title: string,
    date: string,
    language: string,
    text: string
}

export default function Article(props: { articleData: article, convertToHtml: string }) {

    const {articleData, convertToHtml} = props
    if (articleData.language == undefined) {
        articleData.language = 'Default'
    }
    const pageTitle = `${articleData.language} - ${articleData.title}`;
    // const handleWordClick = (word: string) => {
    //     console.log(word)
    // };

    useEffect(() => {
        // 获取所有class为pv-content的元素
        const pvNotes = document.querySelectorAll(".note-new") as NodeListOf<HTMLSpanElement>;

        // 为每个pv-content元素绑定点击事件
        pvNotes.forEach((pvNote) => {
            pvNote.addEventListener("click", handleClick);
        });

        // 定义点击事件处理函数
        function handleClick(this: HTMLSpanElement) {
            console.log(this.innerText);
            this.className = "";
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
    const convertToHtml = await convertMdToHTML(articleData.text)
    return {
        props: {
            articleData,
            convertToHtml: convertToHtml
        },
    };
}
