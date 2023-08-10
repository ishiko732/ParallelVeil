import {getAllArticleIds} from "@/app/(article)/service/article";
import ArticleLink from "@/app/(article)/article/_components/articleLink";

export default function Page() {
    const allArticleData = getAllArticleIds();
    return allArticleData.map((articleData) => <ArticleLink key={articleData.params.id}
                                                            articleData={articleData.params}/>
    )
}