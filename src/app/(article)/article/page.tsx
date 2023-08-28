import {Metadata} from "next";
import {getArticlePaths} from "@/app/(article)/service/article_watch";
import ArticlePaths from "@/app/(article)/article/_components/articlePaths";

export const metadata: Metadata = {
    title: `Parallel Veil - Article`
}
export default async function Page({params}: { params: { slug: string[] } }) {
    const articlePaths = await getArticlePaths();
    return <ArticlePaths articlePaths={articlePaths}/>
}