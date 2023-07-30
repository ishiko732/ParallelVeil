'use client'
import React, {useEffect, useState} from "react";
import {fsrs, FSRSParameters, generatorParameters} from "ts-fsrs";
import FSRS from "ts-fsrs/lib/fsrs";

interface fsrsInterface {
    uid: number,
    params: FSRSParameters
    setParams: React.Dispatch<React.SetStateAction<FSRSParameters>>,
    f: FSRS
    setF: React.Dispatch<React.SetStateAction<FSRS>>
}

// @ts-ignore
const FSRSContext = React.createContext<fsrsInterface>();

export default FSRSContext;

export function FSRSProvider({
                                 uid,
                                 children,
                                 p = generatorParameters()
                             }: { uid: number, children: React.ReactNode, p?: FSRSParameters }) {
    const [params, setParams] = useState<FSRSParameters>(p)
    const [f, setF] = useState<FSRS>(fsrs(p));
    const value = {
        uid,
        params,
        setParams,
        f,
        setF
    }
    useEffect(() => {
        setF(fsrs(params))
    }, [params])

    return <FSRSContext.Provider value={value}>
        {children}
    </FSRSContext.Provider>
}
