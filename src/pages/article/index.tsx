'use client'

import {getAllArticleIds} from "@/service/article";
import ArticleLink from "@/components/article/articleLink";

interface articleData {
    params: {
        id: string
    }
}

export default function Article(params: { allArticleData: articleData[] }) {
    const {allArticleData} = params
    return allArticleData.map((articleData) => <ArticleLink key={articleData.params.id}
                                                            articleData={articleData.params}/>
    )
}


export async function getStaticProps() {
    const allArticleData = getAllArticleIds();
    return {
        props: {
            allArticleData,
        },
    };
}
