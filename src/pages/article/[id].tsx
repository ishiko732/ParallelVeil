import Head from 'next/head';
import Date from '@/components/date';
import {getAllArticleIds, getArticleData} from "@/service/article";

interface article {
    id: string,
    title: string,
    date: string,
    contentHtml: string
}

export default function Article(params: { ArticleData: article }) {
    const {ArticleData} = params
    return (
        <div>
            <Head>
                <title>{ArticleData.title}</title>
            </Head>
            <br/>
            {ArticleData.id}
            <br/>
            <Date dateString={ArticleData.date}/>
            <br/>
            <div dangerouslySetInnerHTML={{__html: ArticleData.contentHtml}}/>
        </div>
    );
}

export async function getStaticPaths() {
    const paths = getAllArticleIds();
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({params}: { params: article }) {
    const ArticleData = await getArticleData(params.id);
    return {
        props: {
            ArticleData,
        },
    };
}