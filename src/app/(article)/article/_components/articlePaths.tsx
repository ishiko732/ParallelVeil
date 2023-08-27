import {FilePath} from "@@/collect/system/src/FileStores";
import ArticlePathCard from "@/app/(article)/article/_components/articlePathCard";


export default function ArticlePaths(params: { articlePaths: FilePath[] }) {
    const {articlePaths} = params
    return (
        <div className="my-8">
            <div className="grid grid-cols-3 gap-4">
                {articlePaths.map((articleData) =>
                    <ArticlePathCard key={'paths' + articleData.name}
                                     articlePath={articleData}/>
                )}
            </div>
        </div>
    )
}