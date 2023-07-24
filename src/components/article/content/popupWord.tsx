import {useCallback, useContext, useEffect, useRef} from "react";
import ExtractContext from "@/context/extractContext";

export default function PopupWord() {
    const props = useContext(ExtractContext)
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