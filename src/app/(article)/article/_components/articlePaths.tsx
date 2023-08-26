import {FilePath} from "@@/collect/system/src/FileStores";
import ArticleLink from "@/app/(article)/article/_components/articleLink";


export default function ArticlePaths(params: { articlePaths: FilePath[] }) {
    const {articlePaths} = params
    return articlePaths.map((articleData) => <ArticleLink key={'paths' + articleData.name}
                                                          articlePath={articleData}/>
    )
}