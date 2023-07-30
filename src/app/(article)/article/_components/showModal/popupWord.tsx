'use client'
import {useCallback, useContext, useEffect, useRef, useState, useTransition} from "react";
import ExtractContext from "@/context/extractContext";
import {Card, Note} from "@prisma/client";
import ShowModal from "@/components/showModal";


export default function PopupWord() {
    let [isPending, startTransition] = useTransition()
    const props = useContext(ExtractContext)
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
    return props.isPopupVisible ?
        (<ShowModal popupPosition={props.popupPosition}
                    style={{
                        top: props.popupPosition.y,
                        left: props.popupPosition.x,
                        maxWidth: '500px'
                    }}
                    ref={popupRef}>
            <div>
                {JSON.stringify(props.currentWordRef.current)}
            </div>
            <hr/>
            <div>
                {JSON.stringify(note)}
            </div>
        </ShowModal>)
        : null
}
