'use client'

import Link from "next/link";
import {useEffect, useState} from "react";

interface articleData {
    id: string
}

export default function ArticleLink(params: { articleData: articleData }) {
    const [path, setPath] = useState("")
    useEffect(() => {
        setPath(window.location.pathname)
    }, [])
    const {articleData} = params
    return <div key={articleData.id}><Link href={`${path}/${articleData.id}`}>{articleData.id}</Link></div>

}