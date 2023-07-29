'use client'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import {useCallback, useContext, useEffect, useRef} from "react";
import ExtractContext from "@/context/extractContext";

export default function CollectSelect() {
    const props = useContext(ExtractContext);
    const popupRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            props.setIsCollectVisible(false);
        }
    }, [props]);

    useEffect(() => {
        if (props.isCollectVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside, props.isCollectVisible]);

    return props.isCollectVisible ? (<div style={{
        position: 'fixed',
        top: props.popupPosition.y,
        left: props.popupPosition.x,
        backgroundColor: '#fff',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
        padding: '10px',
    }}
                                          ref={popupRef}
    >
        {props.textRef.current} <AddToPhotosIcon/>
    </div>) : null
}