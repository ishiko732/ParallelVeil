'use client'
import Date from '@/components/date';
import 'highlight.js/styles/default.css';
import React, {createRef, useCallback, useEffect, useRef, useState} from "react";
import {Card, Note} from "@prisma/client";
import {State, StateType} from "ts-fsrs";
import PopupWord from "@/components/article/content/popupWord";
import CollectSelect from "@/components/article/content/collectSelect";
import ExtractContext, {currentWordInterface, extractInterface} from "@/context/extractContext";
import Head from "next/head";

interface article {
    id: string,
    title: string,
    date: string,
    language: string,
    text: string
}

export default function Article(props: { articleData: article, convertToHtml: string, words: { [key: string]: Note & { card: Card | null } } }) {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isCollectVisible, setIsCollectVisible] = useState(false);
    const [popupPosition, setPopupPosition] = useState({x: 0, y: 0} as point);
    const contentRef = createRef<HTMLDivElement>()
    const currentWordRef = useRef<currentWordInterface>({
        text: '',
        quote: ''
    })
    const textRef = useRef('')


    const extractValue: extractInterface = {
        textRef,
        currentWordRef,
        isPopupVisible,
        setIsPopupVisible,
        isCollectVisible,
        setIsCollectVisible,
        popupPosition,
        setPopupPosition,
    }
    const {articleData, convertToHtml} = props
    if (articleData.language == undefined) {
        articleData.language = 'Default'
    }
    const pageTitle = `${articleData.language} - ${articleData.title}`;

    useEffect(() => {
        const map = props.words
        const pvNotes = document.querySelectorAll(".note") as NodeListOf<HTMLSpanElement>;
        pvNotes.forEach((pvNote) => {
            const note = (map[pvNote.innerText.trim()] as Note & { card: Card })
            if (note === undefined || note.card === undefined) {
                return
            }
            const current = State[note.card.state] as StateType
            pvNote.id = note.nid;
            pvNote.dataset["cid"] = note.card.cid
            pvNote.dataset["state"] = current
            pvNote.dataset['text'] = pvNote.innerText.trim()
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
        if (currentWordRef.current.entity) {
            console.log(currentWordRef.current.entity)
        }
    }, [currentWordRef])


    const handleClick = useCallback((event: MouseEvent) => {
        const vm = event.target as HTMLSpanElement
        // console.log(vm.innerText, vm.parentElement?.parentElement?.innerText);
        textRef.current = vm.innerText
        currentWordRef.current = {
            text: vm.innerText.trim(),
            quote: vm.parentElement?.parentElement?.innerText || '',
            nid: vm.id
        }
        setIsPopupVisible(true);
        setPopupPosition({x: vm.offsetWidth + vm.offsetLeft, y: event.clientY});
        switch (State[vm.dataset["state"] as StateType]) {
            case State.New:
                vm.className = "note note-learn"
                vm.dataset["state"] = State[State.Learning]
                break;
            case State.Learning:
            case State.Relearning:
                vm.className = "note";
                vm.dataset["state"] = State[State.Review]
                break;
            case State.Review:
                break;

        }
    }, [])

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
            <h3>{articleData.id}</h3>
            <hr/>
            <Date dateString={articleData.date}/>
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