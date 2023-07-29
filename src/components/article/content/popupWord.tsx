'use client'
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import ExtractContext from "@/context/extractContext";
import {Card, Note} from "@prisma/client";

export default function PopupWord() {
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
                const data = await fetch('/api/note/' + current.nid, {
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
    return props.isPopupVisible ? (
        <div
            style={{
                position: 'fixed',
                top: props.popupPosition.y,
                left: props.popupPosition.x,
                backgroundColor: '#fff',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                padding: '10px',
            }}
            ref={popupRef}
        >

            <div>
                {JSON.stringify(props.currentWordRef.current)}
            </div>
            <hr/>
            <div>
                {JSON.stringify(note)}
            </div>
        </div>
    ) : null
}
