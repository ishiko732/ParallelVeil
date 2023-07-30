import Link from "next/link";

interface articleData {
    id: string
}

export default function ArticleLink(params: { articleData: articleData }) {
    const {articleData} = params
    return <div key={articleData.id}><Link href={`/article/${articleData.id}`}>{articleData.id}</Link></div>

}