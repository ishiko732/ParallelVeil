'use client'
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import ExtractContext from "@/context/extractContext";
import {Card, Note} from "@prisma/client";
import ShowModal from "@/components/showModal";
import {CircularProgress, Divider} from "@mui/material";
import StateChip from "@/app/(fsrs)/fsrs/_components/state";
import Date from '@/app/(fsrs)/fsrs/_components/date';
import DSR from "@/app/(fsrs)/fsrs/_components/DSR";
import {transCard} from "@/app/(fsrs)/fsrs/help";
import dayjs from "dayjs";
import FSRSContext from "@/context/fsrsContext";
import GradeButtons from "@/app/(fsrs)/fsrs/_components/buttons";
import {Card as fsrsCard, ReviewLog as fsrsLog} from 'ts-fsrs'

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

    useEffect(() => {
        if (props.isPopupVisible) {
            (async () => {
                const current = props.currentWordRef.current
                const data = await fetch(`/api/note/${current.nid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(res => res.json())
                setNote(data)
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
                        maxWidth: '500px'
                    }}
                    ref={popupRef}>
            <div>
                <strong>{props.currentWordRef.current.text}</strong>
                <div>
                    {props.currentWordRef.current.quote}
                </div>
            </div>
            <Divider/>
            {note && note.card ?
                <div>
                    last review:<Date date={note.card.due} format={"YYYY/MM/DD"} inline={true}/>
                    <StateChip state={note.card.state}/>
                    <DSR card={transCard(note.card)} now={dayjs()} fsrs={f}/>
                    <div>
                        <GradeButtons style={{paddingTop: "10px"}} card={transCard(note.card)} now={dayjs()} fsrs={f}
                                      handleClick={handleClick}/>
                    </div>
                </div>
                : <CircularProgress/>}
        </ShowModal>)
        : null
}
