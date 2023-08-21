import Counter from "@/components/counter";
import {Fragment} from "react";
import {Metadata} from "next";
import process from "process";
import {loggerDebug} from "@/config/pinoConfig";

export const metadata: Metadata = {
    title: `Parallel Veil - ${process.env.uid}`
}

export default function Page() {
    return <Fragment>
        <Counter/>
    </Fragment>
}