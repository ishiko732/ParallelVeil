import {Inter} from "next/font/google";
import {PageProps} from "@/types/react";
import ThemeProvider from "@/context/theme-provider";
import React from "react";
import Header from "@/app/(mysite)/components/Head";
import Footer from "@/app/(mysite)/components/Footer";
import '@/app/globals.css';

const inter = Inter({subsets: ["latin"]});


export default function RootLayout({children}: PageProps) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeProvider>
            <div className="flex flex-col min-h-screen">
                <Header/>
                <main className="flex-1 max-w-4xl w-full mx-auto">{children}</main>
                <Footer/>
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}