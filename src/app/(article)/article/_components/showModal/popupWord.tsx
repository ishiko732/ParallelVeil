'use client'
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import ExtractContext from "@/context/extractContext";
import {Card, Note} from "@prisma/client";
import ShowModal from "@/components/showModal";
import {CircularProgress, Divider, Stack} from "@mui/material";
import StateChip from "@/app/(fsrs)/fsrs/_components/state";
import DSR from "@/app/(fsrs)/fsrs/_components/DSR";
import {transCard} from "@/app/(fsrs)/fsrs/help";
import dayjs from "dayjs";
import FSRSContext from "@/context/fsrsContext";
import GradeButtons from "@/app/(fsrs)/fsrs/_components/buttons";
import {Card as fsrsCard, Rating, ReviewLog as fsrsLog, State} from 'ts-fsrs'
import QuoteContainer from "@/app/(article)/article/_components/quote";


export async function getNote(nid: string) {
    return fetch(`/api/note/${nid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json())
}

export async function getJisho(query: string, page: number = 1) {
    return fetch(`/api/jisho?query=${query}&page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: "force-cache"
    }).then(res => res.json()).then(res => res.data)
}

export async function getWeblio_ejje(query: string) {
    return fetch(`/api/weblio/ejje?query=${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: "force-cache"
    }).then(res => res.json())
}


export default function PopupWord() {
    const props = useContext(ExtractContext)
    const {f} = useContext(FSRSContext)
    const popupRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            props.setIsPopupVisible(false);
        }
    }, [props]);
    const [note, setNote] = useState<Note & { card: Card }>()
    const [jisho, setJisho] = useState<any[]>()
    const [ejje, setEjje] = useState<string[]>()
    const [page, setPage] = useState(1)
    const now = dayjs()
    useEffect(() => {
        if (props.isPopupVisible) {
            (async () => {
                const current = props.currentWordRef.current
                if (current.text !== note?.text) {
                    setNote(undefined)
                    setJisho(undefined)
                    setEjje(undefined)
                }
                if (current.nid) {
                    getNote(current.nid).then(data => setNote(data))
                    getJisho(current.text, page).then(answers => setJisho(answers))
                    getWeblio_ejje(current.text).then(answers => setEjje(answers))
                }
            })()
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleClickOutside, props.isPopupVisible]);
    const handleClick = (gradle: { card: fsrsCard, log: fsrsLog }) => {
        props.setIsPopupVisible(false);
        (async () => {
            const current = props.currentWordRef.current

            const _json = {
                _note: {...current.entity, readed: true},
                _card: gradle.card,
                _log: gradle.log
            }
            const data = await fetch(`/api/fsrs/scheduler`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(_json)
            }).then(res => res.json())
            const word = {
                ...current,
                entity: data
            }
            // console.log(data)
            // console.log(word)
            props.handleTransWordClick(word)
            props.currentWordRef.current = word
        })()
        console.log(gradle)
    }
    return props.isPopupVisible ?
        (<ShowModal x={props.popupPosition.x}
                    y={props.popupPosition.y}
                    style={{
                        maxWidth: '500px',
                        overflowX: 'hidden'
                    }}
                    ref={popupRef}>
            {note && note.card ?
                <>
                    <div>
                        <div style={{
                            display: 'flex',
                            alignContent: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}>
                            <strong style={{textAlign: 'center'}}>
                                <StateChip state={note.card.state} value={props.currentWordRef.current.text}
                                           style={{fontSize: '18px'}}/>
                            </strong>
                            {/*<Date date={note.card.due} inline={true} format={'YYYY/MM/DD'}*/}
                            {/*      style={{margin: '0', float: 'right'}}/>*/}
                        </div>
                        <QuoteContainer style={{paddingTop: '5px', paddingBottom: '5px', width: "auto"}}>
                            {props.currentWordRef.current.quote}
                        </QuoteContainer>
                        <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                        >
                            <GradeButtons style={{paddingTop: "10px"}} card={transCard(note.card)} now={dayjs()}
                                          fsrs={f}
                                          groups={note.card.state != State.Review || dayjs(note.card.due).diff(now) < 0 ? undefined : [Rating.Again]}
                                          handleClick={handleClick}/>
                            <DSR card={transCard(note.card)} now={dayjs()} fsrs={f} style={{
                                fontSize: '12px', display: 'flex', flexDirection: 'column'
                            }}/>
                        </Stack>

                    </div>
                    <Divider style={{paddingTop: '10px', width: "auto"}}/>
                    <div>
                        <div>
                            {ejje ? ejje.map((answer, index) => <p
                                key={`ejje-answer${index}`}>{JSON.stringify(answer)}</p>) : <CircularProgress/>}
                        </div>
                        <div>
                            {jisho ? jisho.map((answer, index) => <p
                                key={`jisho-answer${index}`}>{JSON.stringify(answer)}</p>) : <CircularProgress/>}
                        </div>

                    </div>
                </>

                : <CircularProgress/>}
        </ShowModal>)
        : null
}
