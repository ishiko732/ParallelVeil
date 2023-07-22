import "@/styles/article.css"
import {AppProps} from "next/app";

interface CustomPageProps {
    // props
}

export default function MyApp({Component, pageProps}: AppProps<CustomPageProps>) {
    return <Component {...pageProps} />
}