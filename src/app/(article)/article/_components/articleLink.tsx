import Link from "next/link";

interface articleData {
    id: string
    path: string
}

export default function ArticleLink(params: { articleData: articleData }) {
    const {articleData} = params
    return <div key={articleData.id}><Link href={articleData.path}>{articleData.id}</Link></div>

}