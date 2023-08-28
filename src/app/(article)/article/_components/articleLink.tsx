import Link from "next/link";
import {FilePath} from "@@/collect/system/src/FileStores";


export default function ArticleLink(params: { articlePath: FilePath }) {
    const {articlePath} = params
    return <div key={articlePath.name}><Link href={`article/${articlePath.route}`}>{articlePath.name}</Link></div>
}