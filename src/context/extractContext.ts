import React, {Dispatch, MutableRefObject, SetStateAction} from "react";
import {Card, Note} from "@prisma/client";

export interface currentWordInterface {
    text: string,
    quote: string,
    entity?: Note & { card: Card },
    nid?: string

}

export interface extractInterface {
    textRef: MutableRefObject<string>,
    currentWordRef: MutableRefObject<currentWordInterface>,
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


