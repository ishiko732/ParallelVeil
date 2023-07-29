import Counter from "@/components/counter";
import Article from "@/app/(article)/article/_components/article";
import {Fragment} from "react";

export default function Page() {
    return <Fragment>
        <Counter/>
        <br/>
        <Article></Article>
    </Fragment>
}