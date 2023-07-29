import "./article.css"
import {PageProps} from "@/types/react";
import Head from "next/head";
import React from "react";

export default function RootLayout({children,}: PageProps) {
    return <>
        <Head>
            <title>articles</title>
        </Head>
        {children}
    </>

}