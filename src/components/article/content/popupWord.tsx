import {Dispatch, SetStateAction, useCallback, useEffect, useRef} from "react";
import {point} from "@/models/article";

export default function PopupWord(props: {
    isPopupVisible: boolean,
    setIsPopupVisible: Dispatch<SetStateAction<boolean>>,
    popupPosition: point, setPopupPosition: Dispatch<SetStateAction<point>>
}) {
    const popupRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            props.setIsPopupVisible(false);
        }
    }, [props]);

    useEffect(() => {
        if (props.isPopupVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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
                Popup content
            </div>
            <div>
                Popup content
            </div>
            <div>
                Popup content
            </div>
        </div>
    ) : null
}