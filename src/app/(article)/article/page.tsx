import {getAllArticleIds} from "@/app/(article)/service/article";
import ArticleLink from "@/app/(article)/article/_components/articleLink";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: `Parallel Veil - Article`
}
export default function Page({params}: { params: { slug: string[] } }) {
    const allArticleData = getAllArticleIds();
    return allArticleData.map((articleData) => <ArticleLink key={articleData.params.id}
                                                            articleData={articleData.params}/>
    )
}