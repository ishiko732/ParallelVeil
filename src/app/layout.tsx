import { PageProps } from "@/types/react";
import React from "react";
import Header from "@/app/(mysite)/components/Head";
import Footer from "@/app/(mysite)/components/Footer";
import "@/app/globals.css";

export default function RootLayout({ children }: PageProps) {
  return (
    <html lang="en">
      <body>
        <div className="bg-zinc-50 dark:bg-slate-800 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 max-w-5xl sm:max-w-4xl w-full mx-auto">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
