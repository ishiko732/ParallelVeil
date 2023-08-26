import {Metadata} from "next";
import process from "process";
import {redirect} from 'next/navigation';

export const metadata: Metadata = {
    title: `Parallel Veil - ${process.env.uid}`
}

export default function Page() {
    redirect('/article');
}