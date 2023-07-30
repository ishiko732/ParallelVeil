// import "./globals.css";
import {Inter} from "next/font/google";
import {PageProps} from "@/types/react";
import ThemeProvider from "@/context/theme-provider";

const inter = Inter({subsets: ["latin"]});


export default function RootLayout({children}: PageProps) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
        </body>
        </html>
    );
}