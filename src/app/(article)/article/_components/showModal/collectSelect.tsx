'use client'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import {useCallback, useContext, useEffect, useRef} from "react";
import ExtractContext from "@/context/extractContext";
import ShowModal from "@/components/showModal";


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

    return props.isCollectVisible ? (
            <ShowModal x={props.popupPosition.x}
                       y={props.popupPosition.y}
                       style={{
                           maxWidth: '500px'
                       }}
                       ref={popupRef}> {props.textRef.current}<AddToPhotosIcon/>
            </ShowModal>)
        : null
}