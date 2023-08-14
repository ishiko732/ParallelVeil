'use client'
import Date from '@/app/(fsrs)/fsrs/_components/date';
import 'highlight.js/styles/default.css';
import React, {createRef, useEffect, useRef, useState} from "react";
import {Card, Note} from "@prisma/client";
import {State} from "ts-fsrs";
import PopupWord from "@/app/(article)/article/_components/showModal/popupWord";
import CollectSelect from "@/app/(article)/article/_components/showModal/collectSelect";
import ExtractContext, {currentWordInterface, extractInterface} from "@/context/extractContext";
import Head from "next/head";
import dayjs from "dayjs";
import {loggerDebug} from "@/config/pinoConfig";

interface article {
    id: string,
    title: string,
    date: string,
    language: string,
    text: string
}

export default function Article(props: {
    articleData: article,
    convertToHtml: string,
    words: { [key: string]: Note & { card: Card | null } }
}) {
    const [data, setData] = useState(props.words)
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isCollectVisible, setIsCollectVisible] = useState(false);
    const [popupPosition, setPopupPosition] = useState({x: 0, y: 0} as point);
    const contentRef = createRef<HTMLDivElement>()
    const currentWordRef = useRef<currentWordInterface>({
        text: '',
        quote: ''
    })
    const textRef = useRef('')

    const handleTransWordClick = (word: currentWordInterface) => {
        const temp = word.entity as (Note & { card: Card })
        temp.card.due = dayjs(temp.card.due).toDate()
        temp.card.last_review = dayjs(temp.card.last_review as Date).toDate()
        setData(map => {
            return {
                ...map,
                [word.text]: temp
            }
        })
    }


    const extractValue: extractInterface = {
        textRef,
        currentWordRef,
        isPopupVisible,
        setIsPopupVisible,
        isCollectVisible,
        setIsCollectVisible,
        popupPosition,
        setPopupPosition,
        handleTransWordClick
    }
    const {articleData, convertToHtml} = props
    if (articleData.language == undefined) {
        articleData.language = 'Default'
    }
    const pageTitle = `${articleData.language} - ${articleData.title}`;


    useEffect(() => {
        const pvNotes = document.querySelectorAll(".note") as NodeListOf<HTMLSpanElement>;
        const now = dayjs().toDate().getTime()
        pvNotes.forEach((pvNote) => {
            const note = (data[pvNote.innerText.trim()] as Note & { card: Card })
            if (note === undefined || note.card === undefined) {
                return
            }
            switch (note.card.state) {
                case State.New:
                    pvNote.className = "note note-new";
                    break
                case State.Learning:
                case State.Relearning:
                    pvNote.className = "note note-learn"
                    break
                case State.Review:
                    if (note.card.due.getTime() - now < 0) {
                        pvNote.className = "note note-recall"
                    }
                    break
            }
        });
    }, [props, isPopupVisible, isCollectVisible, data])

    const handleClick = (event: MouseEvent) => {
        const vm = event.target as HTMLSpanElement
        loggerDebug("selectText", {caller: vm.innerText})
        loggerDebug("selectPhrase", {caller: vm.parentElement?.parentElement?.innerText})
        textRef.current = vm.innerText.trim() as string
        const note = props.words[textRef.current] as Note & { card: Card }
        const card = note.card
        currentWordRef.current = {
            text: note.text,
            quote: vm.parentElement?.parentElement?.innerText || '',
            nid: note.nid,
            entity: note
        }
        setIsPopupVisible(true);
        setPopupPosition({x: vm.offsetWidth + vm.offsetLeft, y: event.clientY});
    }


    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const text =
                window.getSelection()?.toString().replace(/\r\n/g, "")
                    .replace(/\n/g, "");
            const vm = event.target as HTMLDivElement
            if (text) {
                textRef.current = text
                setPopupPosition({x: vm.offsetWidth + vm.offsetLeft, y: event.clientY});
                setIsCollectVisible(true)
                //TODO
                // const range = window.getSelection()?.getRangeAt(0);
                // const copy=range?.cloneContents() as DocumentFragment
                // // const span = document.createElement('span');
                // // span.textContent = text;
                // // span.style.textDecoration = 'underline';
                // range?.deleteContents();
                // range?.insertNode(copy);
            }
        }
        const e = contentRef.current
        if (e) {
            e.addEventListener("mouseup", handleClick)
            return () => {
                e.removeEventListener("mouseup", handleClick)
            }
        }

    }, [contentRef])
    useEffect(() => {
        // 获取所有class为pv-content的元素
        const pvNotes = document.querySelectorAll(".note") as NodeListOf<HTMLSpanElement>;

        // 为每个pv-content元素绑定点击事件
        pvNotes.forEach((pvNote) => {
            pvNote.addEventListener("click", handleClick);
        });

        // 在组件卸载时解绑所有点击事件
        return () => {
            pvNotes.forEach((pvNote) => {
                pvNote.removeEventListener("click", handleClick);
            });
        };
    }, [handleClick]);

    return (
        <div>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            <br/>
            <h3>{articleData.title}</h3>
            <hr/>
            <Date date={articleData.date}/>
            <br/>
            <ExtractContext.Provider value={extractValue}>
                <CollectSelect/>
                <PopupWord/>
            </ExtractContext.Provider>
            <div ref={contentRef}
                 className="pv-container"
                 dangerouslySetInnerHTML={{__html: convertToHtml}}/>
        </div>
    );
}