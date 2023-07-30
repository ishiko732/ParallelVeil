import {getAllArticleIds} from "@/service/article";
import ArticleLink from "@/app/(article)/article/_components/articleLink";
import 'server-only'

export default function Article() {
    const allArticleData = getAllArticleIds();
    return allArticleData.map((articleData) => <ArticleLink key={articleData.params.id}
                                                            articleData={articleData.params}/>
    )
}

