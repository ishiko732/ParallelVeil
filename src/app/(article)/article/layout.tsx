import "./article.css"
import {PageProps} from "@/types/react";
import React from "react";

export default function RootLayout({children,}: PageProps) {
    return <>
        {children}
    </>

}