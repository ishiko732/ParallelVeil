import Counter from "@/components/counter";
import Article from "@/app/(article)/article/_components/article";
import {Fragment} from "react";
import {Metadata} from "next";
import process from "process";

export const metadata: Metadata = {
    title: `Parallel Veil - ${process.env.uid}`
}
const text = () => {
    console.log("test init")
}


export default function Page() {
    text()
    return <Fragment>
        <Counter/>
        <br/>
        <Article></Article>
    </Fragment>
}