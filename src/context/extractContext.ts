import React, {Dispatch, MutableRefObject, SetStateAction} from "react";
import {point} from "@/models/article";

export interface extractInterface {
    textRef: MutableRefObject<string>,
    isCollectVisible: boolean,
    setIsCollectVisible: Dispatch<SetStateAction<boolean>>,
    isPopupVisible: boolean,
    setIsPopupVisible: Dispatch<SetStateAction<boolean>>,
    popupPosition: point,
    setPopupPosition: Dispatch<SetStateAction<point>>
}

// @ts-ignore
const ExtractContext = React.createContext<extractInterface>();

export default ExtractContext;


